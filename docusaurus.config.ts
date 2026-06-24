import { themes as prismThemes } from 'prism-react-renderer';
import type { Config } from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

const config: Config = {
  title: 'vimpin',
  tagline: 'Pin Vim/Neovim plugin specs to explicit commit hashes',
  favicon: 'img/logo.svg',

  url: 'https://vimpin.grimoh.net',
  baseUrl: '/',

  organizationName: 'gr1m0h',
  projectName: 'vimpin-docs',

  onBrokenLinks: 'throw',

  markdown: {
    hooks: {
      onBrokenMarkdownLinks: 'warn',
    },
  },

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
          routeBasePath: 'docs',
          editUrl: 'https://github.com/gr1m0h/vimpin-docs/edit/main/docs/',
        },
        blog: false,
        theme: {
          customCss: './src/css/custom.css',
        },
        sitemap: {
          changefreq: 'weekly',
          priority: 0.5,
        },
      } satisfies Preset.Options,
    ],
  ],

  themeConfig: {
    colorMode: {
      defaultMode: 'light',
      respectPrefersColorScheme: true,
    },
    navbar: {
      title: 'vimpin',
      logo: {
        alt: 'vimpin logo',
        src: 'img/logo.svg',
      },
      items: [
        {
          type: 'docSidebar',
          sidebarId: 'docsSidebar',
          position: 'left',
          label: 'Docs',
        },
        {
          href: 'https://github.com/gr1m0h/vimpin',
          label: 'vimpin',
          position: 'right',
        },
        {
          href: 'https://github.com/gr1m0h/vimpin-action',
          label: 'vimpin-action',
          position: 'right',
        },
        {
          href: 'https://github.com/gr1m0h/vimpin-renovate-config',
          label: 'vimpin-renovate-config',
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
            { label: 'Introduction', to: '/docs/intro' },
            { label: 'Getting Started', to: '/docs/getting-started' },
            { label: 'FAQ', to: '/docs/faq' },
          ],
        },
        {
          title: 'Projects',
          items: [
            { label: 'vimpin', href: 'https://github.com/gr1m0h/vimpin' },
            { label: 'vimpin-action', href: 'https://github.com/gr1m0h/vimpin-action' },
            { label: 'vimpin-renovate-config', href: 'https://github.com/gr1m0h/vimpin-renovate-config' },
          ],
        },
        {
          title: 'More',
          items: [
            { label: 'Docs repository', href: 'https://github.com/gr1m0h/vimpin-docs' },
            { label: 'grimoh.net', href: 'https://grimoh.net' },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} gr1m0h. MIT License.`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
      additionalLanguages: ['lua', 'bash', 'json', 'yaml', 'go'],
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
