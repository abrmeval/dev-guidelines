import {themes as prismThemes} from 'prism-react-renderer';
import type {Config} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

const config: Config = {
  title: 'Dev Guidelines',
  tagline: 'Personal development conventions and best practices for consistent, high-quality code',
  favicon: 'img/favicon.ico',

  // Future flags, see https://docusaurus.io/docs/api/docusaurus-config#future
  future: {
    v4: true, // Improve compatibility with the upcoming Docusaurus v4
  },

  // Set the production url of your site here
  url: 'https://abrmeval.github.io',
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  baseUrl: '/dev-guidelines/',

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: 'abrmeval', // Usually your GitHub org/user name.
  projectName: 'dev-guidelines', // Usually your repo name.

  onBrokenLinks: 'throw',

  // Even if you don't use internationalization, you can use this field to set
  // useful metadata like html lang. For example, if your site is Chinese, you
  // may want to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  presets: [
    [
      'classic',
      {
        docs: {
          sidebarPath: './sidebars.ts',
          routeBasePath: '/',
          editUrl: 'https://github.com/abrmeval/dev-guidelines/edit/main/dev-guidelines/',
        },
        blog: false,
        theme: {
          customCss: './src/css/custom.css',
        },
      } satisfies Preset.Options,
    ],
  ],

  themeConfig: {
    // Replace with your project's social card
    image: 'img/docusaurus-social-card.jpg',
    colorMode: {
      respectPrefersColorScheme: true,
    },
    navbar: {
      title: 'Dev Guidelines',
      logo: {
        alt: 'Dev Guidelines Logo',
        src: 'img/logo.svg',
      },
      items: [
        {
          type: 'docSidebar',
          sidebarId: 'guidelinesSidebar',
          position: 'left',
          label: 'Guidelines',
        },
        {
          href: 'https://github.com/abrmeval/dev-guidelines',
          label: 'GitHub',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Docs',
          items: [
            {
              label: 'Introduction',
              to: '/',
            },
            {
              label: '.NET Architecture',
              to: '/DotNET/VERTICALSLICE',
            },
            {
              label: 'Backend',
              to: '/Backend/NAMING_CONVENTIONS',
            },
            {
              label: 'Frontend',
              to: '/Frontend/React/NAMING_CONVENTIONS',
            },
          ],
        },
        {
          title: 'Categories',
          items: [
            {
              label: 'Git Conventions',
              to: '/Git/Commit',
            },
            {
              label: 'Testing',
              to: '/Testing/UnitTesting/TOOLS',
            },
            {
              label: 'Documentation',
              to: '/Documentation/REQUIRED_DOCS',
            },
          ],
        },
        {
          title: 'More',
          items: [
            {
              label: 'GitHub',
              href: 'https://github.com/abrmeval/dev-guidelines',
            },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} Dev Guidelines. Built with Docusaurus.`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
      additionalLanguages: ['csharp', 'bash', 'typescript', 'javascript', 'json'],
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
