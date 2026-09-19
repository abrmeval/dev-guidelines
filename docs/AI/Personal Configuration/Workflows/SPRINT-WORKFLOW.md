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
 *     sprint-planner -> sprint-executor -> auditor
 *       (issues at any point -> developer fixes -> step re-runs)
 *
 *   Phase 2 — testing:
 *     unit-tester -> test-planner -> e2e-tester -> ui-ux-tester
 *       (issues at any point -> developer fixes -> step re-runs)
 *
 * Every agent returns exactly one of:
 *   { isOk: true,  result: "<markdown report>" }          — success
 *   { isOk: false, result: [{ issue, fix }] }             — issues + remediations
 *
 * The function returns one consolidated markdown report of all step results.
 */
const sprintExtension = {
  version: "1.0.0",
  headline: "Sprint workflow",
  functions: {
    sprintWorkflow: {
      description:
        "Run a full sprint cycle: planning, execution and audit (development phase), then unit tests, test planning, e2e and ui-ux verification (testing phase). Issues are routed to a developer agent and re-verified. Returns a consolidated markdown report.",

      // ---- Input contract -------------------------------------------------
      input: {
        type: "object",
        properties: {
          sprint: {
            type: "string",
            description:
              "Sprint identifier or sprint file path, e.g. 'sprint-4' or 'docs/ai/sprints/sprint-4.md'.",
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

        /**
         * Runs one step. If the agent reports issues, the developer agent
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

            // Issues found -> developer resolves them.
            const fix = await context.agent(
              context.prompt(
                "The {step} agent reported the following issues:\n" +
                  "<issues>{issues}</issues>\n\n" +
                  "Resolve every issue by applying its suggested fix in the repository." +
                  RESULT_CONTRACT,
                { step, issues: last.result }
              ),
              { role: "developer", label: `developer:${step}`, outputSchema: agentResultSchema }
            );
            record(phase, `fix:${step}`, "developer", fix);
            if (!fix.isOk) return last; // developer blocked; keep issues on record

            // Developer succeeded -> re-run the same step on the fixed repo.
            request = context.prompt(
              instruction +
                "\n\nA previous round found issues that the developer has now addressed. " +
                "Re-run and verify.\n" +
                "<previous_issues>{issues}</previous_issues>\n" +
                "<developer_fix>{fix}</developer_fix>" +
                RESULT_CONTRACT,
              { ...values, issues: last.result, fix: fix.result }
            );
          }
          return last;
        };

        // =================================================================
        // Phase 1 — Planning
        // =================================================================

        context.phase("planning");

        const plan = await runStep(
          "planning",
          "plan",
          "sprint-planner",
          "Plan the sprint: {sprint}.\n\n" +
            "Read the sprint file and docs/ai/sprints/SPRINTS-OVERVIEW.md first. " +
            "Produce an execution plan: goals, ordered task breakdown, dependencies, " +
            "risks, and acceptance criteria per task.",
          { sprint }
        );

        // =================================================================
        // Phase 2 — Development (execution, audit)
        // =================================================================
        context.phase("development");

        const execution = await runStep(
          "development",
          "execution",
          "sprint-executor",
          "Execute the sprint tasks for: {sprint}.\n\n" +
            "Read this project context first:\n" +
            "- AGENTS.md at the repository root\n" +
            "- docs/ai/sprints/SPRINTS-OVERVIEW.md\n" +
            "- the sprint file: {sprint}\n" +
            "- any other docs/ files you need\n\n" +
            "The sprint plan:\n<plan>{plan}</plan>\n\n" +
            "Implement every task in the plan following AGENTS.md conventions. " +
            "Verify with the repository's build and test commands before finishing.",
          { sprint, plan: plan.result }
        );

        const audit = await runStep(
          "development",
          "audit",
          "auditor",
          "Audit the completed sprint work for: {sprint}.\n\n" +
            "The executor's summary:\n<summary>{summary}</summary>\n\n" +
            "Check the work against the sprint tasks and AGENTS.md standards: " +
            "correctness, conventions, leftover TODOs, build and test health. " +
            "Report every issue with a concrete fix; return markdown approval " +
            "only if nothing is wrong.",
          { sprint, summary: execution.result }
        );

        // =================================================================
        // Phase 3 — Testing (unit, test plan, e2e, ui-ux)
        // =================================================================
        context.phase("testing");

        const unit = await runStep(
          "testing",
          "unit testing",
          "unit-tester",
          "Run and verify the unit tests for the sprint work: {sprint}.\n\n" +
            "The executor's summary:\n<summary>{summary}</summary>\n\n" +
            "Run the repository's unit test commands. Report each failure with " +
            "its fix; return markdown results when the suite is green.",
          { sprint, summary: execution.result }
        );

        const testPlan = await runStep(
          "testing",
          "test planning",
          "test-planner",
          "Create a test plan for the sprint work: {sprint}.\n\n" +
            "Executor summary:\n<summary>{summary}</summary>\n\n" +
            "Unit test report:\n<unit_report>{unitReport}</unit_report>\n\n" +
            "Plan the remaining verification: end-to-end scenarios and UI checks, " +
            "each with concrete steps and expected outcomes.",
          { sprint, summary: execution.result, unitReport: unit.result }
        );

        const e2e = await runStep(
          "testing",
          "e2e testing",
          "e2e-tester",
          "Execute the end-to-end test plan for: {sprint}.\n\n" +
            "The test plan:\n<test_plan>{testPlan}</test_plan>\n\n" +
            "Run each scenario end-to-end. Report each failure with its fix; " +
            "return markdown results when all scenarios pass.",
          { sprint, testPlan: testPlan.result }
        );

        const uiux = await runStep(
          "testing",
          "ui/ux testing",
          "ui-ux-tester",
          "Verify the UI/UX of the sprint deliverables for: {sprint}.\n\n" +
            "Executor summary:\n<summary>{summary}</summary>\n\n" +
            "Check the UI against docs/ai/ui-design-rules.md: layout, spacing, " +
            "colors, component states, responsiveness. Be strict about " +
            "pixel-level correctness. Report each issue with its fix; return " +
            "markdown results when the UI is correct.",
          { sprint, summary: execution.result }
        );

        // =================================================================
        // Consolidation — assemble the final markdown report
        // =================================================================
        // Final outcome per step (re-runs overwrite earlier rounds).
        const byStep = new Map();
        for (const s of steps) byStep.set(s.step, s);
        const finalSteps = [...byStep.values()].filter(
          (s) => !s.step.startsWith("fix:")
        );
        const devFixes = steps.filter((s) => s.agent === "developer");
        const unresolved = finalSteps.filter((s) => !s.isOk);

        const section = (s) =>
          `### ${s.step} (${s.agent}) — ${s.isOk ? "OK" : "UNRESOLVED ISSUES"}\n\n${s.detail}\n`;

        const report = [
          `# Sprint Workflow Report — ${sprint}`,
          "",
          `- **Overall:** ${
            unresolved.length === 0
              ? "ALL STEPS PASSED"
              : `UNRESOLVED — ${unresolved.map((s) => s.step).join(", ")}`
          }`,
          `- **Developer interventions:** ${devFixes.length}${
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
                  (s) => `- **${s.step}** — see its section above for issues and suggested fixes`
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
            ? `Sprint workflow complete — all steps passed (${devFixes.length} developer fix round(s)).`
            : `Sprint workflow finished with unresolved issues in: ${unresolved
                .map((s) => s.step)
                .join(", ")}.`
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