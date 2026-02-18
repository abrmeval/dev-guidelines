import type {SidebarsConfig} from '@docusaurus/plugin-content-docs';

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

/**
 * Creating a sidebar enables you to:
 - create an ordered group of docs
 - render a sidebar for each doc of that group
 - provide next/previous navigation

 The sidebars can be generated from the filesystem, or explicitly defined here.

 Create as many sidebars as you want.
 */
const sidebars: SidebarsConfig = {
  guidelinesSidebar: [
    'intro',
    {
      type: 'category',
      label: '.NET Architecture',
      collapsed: false,
      items: [
        'DotNET/VERTICALSLICE',
        'DotNET/MICROSERVICES',
        'DotNET/MODULARMONOLITHIC',
        'DotNET/MONOLITHIC',
        'DotNET/MVC',
      ],
    },
    {
      type: 'category',
      label: 'Backend',
      collapsed: false,
      items: [
        'Backend/NAMING_CONVENTIONS',
        'Backend/PROJECTS_NAMING_CONVENTIONS',
        'Backend/API_VERSIONING',
        'Backend/DESIGN_PATTERNS',
      ],
    },
    {
      type: 'category',
      label: 'Frontend',
      collapsed: false,
      items: [
        {
          type: 'category',
          label: 'React',
          items: [
            'Frontend/React/NAMING_CONVENTIONS',
            'Frontend/React/PROJECT_STRUCTURE',
            'Frontend/React/BUILD_TOOLS',
          ],
        },
        {
          type: 'category',
          label: 'Vue',
          items: [
            'Frontend/Vue/NAMING_CONVENTIONS',
            'Frontend/Vue/PROJECT_STRUCTURE',
          ],
        },
        {
          type: 'category',
          label: 'Vanilla JS',
          items: [
            'Frontend/VanillaJS/NAMING_CONVENTIONS',
          ],
        },
      ],
    },
    {
      type: 'category',
      label: 'Database',
      collapsed: false,
      items: [
        'Database/NAMING_CONVENTIONS',
      ],
    },
    {
      type: 'category',
      label: 'Cloud',
      collapsed: false,
      items: [
        'Cloud/NAMING_CONVENTIONS',
      ],
    },
    {
      type: 'category',
      label: 'Git',
      collapsed: false,
      items: [
        'Git/Commit',
        'Git/PR',
      ],
    },
    {
      type: 'category',
      label: 'Documentation',
      collapsed: false,
      items: [
        'Documentation/REQUIRED_DOCS',
        'Documentation/STRUCTURE',
        'Documentation/NAMING_CONVENTIONS',
        'Documentation/TOOLS',
      ],
    },
    {
      type: 'category',
      label: 'Testing',
      collapsed: false,
      items: [
        'Testing/UnitTesting/TOOLS',
        'Testing/Integration/TOOLS',
        'Testing/End-End/TOOLS',
      ],
    },
  ],
};

export default sidebars;
