# Sprint Workflow

A PI agent workflow for software development from planning to testing.

```typescript
// Import by relative path into pi's package install (~/.pi/agent/npm/node_modules).
// This resolves to the same module instance pi already loaded, so the function
// registers into the live workflow registry.
import { registerWorkflowExtension } from "../npm/node_modules/pi-extensible-workflows/dist/src/index.js";

/**
 * sprintWorkflow
 * --------------
 * Runs a full sprint cycle with 8 role-based agents:
 *
 *   Phase 1 — development:
 *      sprint-executor -> auditor
 *       (issues at any point -> dev-fixer fixes -> step re-runs)
 *
 *   Phase 2 — testing:
 *     unit-tester -> test-planner -> e2e-tester -> ui-ux-tester
 *       (issues at any point -> dev-fixer fixes -> step re-runs)
 *
 * Every agent returns exactly one of:
 *   { isOk: true,  result: "<markdown report>" }          — success
 *   { isOk: false, result: [{ issue, fix }] }             — issues + remediations
 *
 * The function returns one consolidated markdown report of all step results.
 */
const sprintExtension = {
  version: "1.0.0",
  headline: "Sprint Dev workflow",
  functions: {
    sprintDevWorkflow: {
      description:
        "Run a full sprint cycle: from executing a sprint plan, audit (development phase), then unit tests, test planning, e2e and ui-ux verification (testing phase). Issues are routed to a dev-fixer agent and re-verified. Returns a consolidated markdown report.",

      // ---- Input contract -------------------------------------------------
      input: {
        type: "object",
        properties: {
          sprint: {
            type: "string",
            description:
              "Sprint identifier or sprint file path, e.g. 'sprint-4' or 'docs/sprints/sprint-4.md'.",
          },
          maxFixRounds: {
            type: "integer",
            minimum: 1,
            maximum: 5,
            description:
              "Maximum verify-fix rounds per step before issues are recorded as unresolved. Default 3.",
          },
        },
        required: ["sprint"],
        additionalProperties: false,
      },

      // ---- Output contract ------------------------------------------------
      output: { type: "string" }, // consolidated markdown report

      async run(input, context) {
        const sprint = String(input.sprint).trim();
        const maxFixRounds =
          typeof input.maxFixRounds === "number" ? input.maxFixRounds : 3;

        // Shared result schema enforced on every agent call.
        const agentResultSchema = {
          type: "object",
          properties: {
            isOk: { type: "boolean" },
            result: {
              oneOf: [
                { type: "string" }, // markdown report on success
                {
                  type: "array", // issues + remediations on failure
                  items: {
                    type: "object",
                    properties: {
                      issue: { type: "string" },
                      fix: { type: "string" },
                    },
                    required: ["issue", "fix"],
                    additionalProperties: false,
                  },
                },
              ],
            },
          },
          required: ["isOk", "result"],
          additionalProperties: false,
        };

        // Appended to every agent prompt so the output contract is explicit.
        const RESULT_CONTRACT = [
          "",
          "Output contract (schema-enforced):",
          '- success: { "isOk": true, "result": "<markdown report>" }',
          '- issues:  { "isOk": false, "result": [{ "issue": "...", "fix": "..." }] }',
        ].join("\n");

        // Journal of every agent outcome, in execution order.
        // { phase, step, agent, isOk, detail }
        const steps = [];

        const toMarkdown = (res) => {
          if (typeof res.result === "string") return res.result;
          if (Array.isArray(res.result)) {
            return res.result
              .map((i) => `- **Issue:** ${i.issue}\n  - **Fix:** ${i.fix}`)
              .join("\n");
          }
          return "- (no details returned)";
        };

        const record = (phase, step, agent, res) => {
          steps.push({
            phase,
            step,
            agent,
            isOk: res.isOk,
            detail: toMarkdown(res),
          });
        };

        const logError = (result, agent) => {
          context.log(
            `The ${agent} returned the following: ` +
              result
                .map((m) => {
                  return "issue: " + m.issue + "; fix: " + m.fix;
                })
                .join(".\n"),
          );
        };

        /**
         * Runs one step. If the agent reports issues, the dev-fixer agent
         * applies the fixes and the step re-runs to verify — bounded by
         * maxFixRounds. Returns the step's final result.
         */
        const runStep = async (phase, step, role, instruction, values) => {
          let request = context.prompt(instruction + RESULT_CONTRACT, values);
          let last = null;

          for (let round = 1; round <= maxFixRounds; round += 1) {
            context.log(`[${phase}] ${step} — round ${round}`);

            last = await context.agent(request, {
              role,
              label: step,
              outputSchema: agentResultSchema,
            });
            record(phase, step, role, last);
            if (last.isOk) return last;
            if (round === maxFixRounds) return last;

            // Issues found -> dev-fixer resolves them.
            const fix = await context.agent(
              context.prompt(
                "The {step} agent reported the following issues:\n" +
                  "<issues>{issues}</issues>\n\n" +
                  "Resolve every issue by applying its suggested fix in the repository." +
                  RESULT_CONTRACT,
                { step, issues: last.result },
              ),
              {
                role: "dev-fixer",
                label: `dev fixer:${step}`,
                outputSchema: agentResultSchema,
              },
            );
            record(phase, `fix:${step}`, "dev-fixer", fix);
            if (!fix.isOk) return last; // dev-fixer blocked; keep issues on record

            // dev-fixer succeeded -> re-run the same step on the fixed repo.
            request = context.prompt(
              instruction +
                "\n\nA previous round found issues that the dev-fixer has now addressed. " +
                "Re-run and verify.\n" +
                "<previous_issues>{issues}</previous_issues>\n" +
                "<dev-fixer>{fix}</dev-fixer>" +
                RESULT_CONTRACT,
              { ...values, issues: last.result, fix: fix.result },
            );
          }
          return last;
        };

        // =================================================================
        // Phase 1 — Development (execution, audit)
        // =================================================================
        context.phase("development");

        const execution = await runStep(
          "development",
          "execution",
          "sprint-executor",
          "Read and execute the following sprint: {sprint}.",
          { sprint },
        );

        if (!execution.isOk) {
          logError(execution.result, "sprint-executor");
          return;
        }

        const audit = await runStep(
          "development",
          "audit",
          "auditor",
          "Review the code for the sprint: {sprint}." +
            "The sprint-executor's agent response:\n<response>{response}</response>\n\n",
          { sprint, response: execution.result },
        );

        if (!audit.isOk) {
          logError(audit.result, "auditor");
          return;
        }

        // =================================================================
        // Phase 2 — Testing (unit, test plan, e2e, ui-ux)
        // =================================================================
        context.phase("testing");

        const unit = await runStep(
          "testing",
          "unit testing",
          "unit-tester",
          "Create (if necessary), run and verify the unit tests for the sprint: {sprint}.\n\n" +
            "Run the repository's unit test commands.",
          { sprint },
        );

        if (!unit.isOk) {
          logError(unit.result, "unit-tester");
          return;
        }

        const testPlan = await runStep(
          "testing",
          "test planning",
          "test-planner",
          "Create a test plan for the sprint: {sprint}.",
          { sprint },
        );

        if (!testPlan.isOk) {
          logError(testPlan.result, "test-planner");
          return;
        }

        const e2e = await runStep(
          "testing",
          "e2e testing",
          "e2e-tester",
          "Execute the end-to-end test plan for: {sprint}.\n\n" +
            "The test plan:\n<test_plan>{testPlan}</test_plan>\n\n" +
            "Run each scenario end-to-end. Report each failure with its fix.",
          { sprint, testPlan: testPlan.result },
        );

        if (!e2e.isOk) {
          logError(e2e.result, "e2e-tester");
          return;
        }

        const uiux = await runStep(
          "testing",
          "ui/ux testing",
          "ui-ux-tester",
          "Verify the UI/UX of the sprint deliverables for: {sprint}.\n\n" +
            "The test plan:\n<test_plan>{testPlan}</test_plan>",
          { sprint, testPlan: testPlan.result },
        );

        if (!uiux.isOk) {
          logError(uiux.result, "ui-ux-tester");
          return;
        }

        // =================================================================
        // Consolidation — assemble the final markdown report
        // =================================================================
        // Final outcome per step (re-runs overwrite earlier rounds).
        const byStep = new Map();
        for (const s of steps) byStep.set(s.step, s);
        const finalSteps = [...byStep.values()].filter(
          (s) => !s.step.startsWith("fix:"),
        );
        const devFixes = steps.filter((s) => s.agent === "dev-fixer");
        const unresolved = finalSteps.filter((s) => !s.isOk);

        const section = (s) =>
          `### ${s.step} (${s.agent}) — ${s.isOk ? "OK" : "UNRESOLVED ISSUES"}\n\n${s.detail}\n`;

        const report = [
          `# Sprint Dev Workflow Report — ${sprint}`,
          "",
          `- **Overall:** ${
            unresolved.length === 0
              ? "ALL STEPS PASSED"
              : `UNRESOLVED — ${unresolved.map((s) => s.step).join(", ")}`
          }`,
          `- **dev-fixer interventions:** ${devFixes.length}${
            devFixes.length
              ? ` (${devFixes.map((f) => f.step.replace("fix:", "")).join(", ")})`
              : ""
          }`,
          "",
          "## Phase 1 — Development (planning, execution, audit)",
          "",
          ...finalSteps.filter((s) => s.phase === "development").map(section),
          "## Phase 2 — Testing (unit, test plan, e2e, ui-ux)",
          "",
          ...finalSteps.filter((s) => s.phase === "testing").map(section),
          ...(unresolved.length
            ? [
                "## Unresolved Issues",
                "",
                ...unresolved.map(
                  (s) =>
                    `- **${s.step}** — see its section above for issues and suggested fixes`,
                ),
                "",
              ]
            : []),
          "---",
          `*Audit status:* ${audit.isOk ? "passed" : "issues recorded"} · ` +
            `*Unit:* ${unit.isOk ? "passed" : "issues"} · ` +
            `*E2E:* ${e2e.isOk ? "passed" : "issues"} · ` +
            `*UI/UX:* ${uiux.isOk ? "passed" : "issues"}`,
        ].join("\n");

        context.log(
          unresolved.length === 0
            ? `Workflow complete — all steps passed (${devFixes.length} dev-fixer fix round(s)).`
            : `Workflow finished with unresolved issues in: ${unresolved
                .map((s) => s.step)
                .join(", ")}.`,
        );

        return report;
      },
    },
  },
};

export default function extension() {
  registerWorkflowExtension(sprintExtension);
}

```