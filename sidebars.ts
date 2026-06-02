import type { SidebarsConfig } from '@docusaurus/plugin-content-docs';

const sidebars: SidebarsConfig = {
  docsSidebar: [
    'intro',
    'getting-started',
    'examples',
    {
      type: 'category',
      label: 'vimpin (CLI)',
      collapsed: false,
      items: [
        'vimpin/overview',
        'vimpin/installation',
        'vimpin/quickstart',
        'vimpin/canonical-form',
        'vimpin/commands',
        'vimpin/authentication',
        'vimpin/comparison',
      ],
    },
    {
      type: 'category',
      label: 'vimpin-action',
      collapsed: false,
      items: [
        'vimpin-action/overview',
        'vimpin-action/quickstart',
        'vimpin-action/inputs',
        'vimpin-action/outputs',
        'vimpin-action/modes',
        'vimpin-action/recipes',
        'vimpin-action/versioning',
      ],
    },
    {
      type: 'category',
      label: 'vimpin-renovate-config',
      collapsed: false,
      items: [
        'vimpin-renovate-config/overview',
        'vimpin-renovate-config/usage',
        'vimpin-renovate-config/spec-form',
        'vimpin-renovate-config/lazy-lock',
        'vimpin-renovate-config/recommended-config',
        'vimpin-renovate-config/caveats',
      ],
    },
    {
      type: 'category',
      label: 'Guides',
      collapsed: false,
      items: [
        'guides/ci-setup',
        'guides/update-workflow',
        'guides/supply-chain',
      ],
    },
    'faq',
    'resources',
  ],
};

export default sidebars;
