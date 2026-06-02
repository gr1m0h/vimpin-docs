import type { SidebarsConfig } from '@docusaurus/plugin-content-docs';

const sidebars: SidebarsConfig = {
  docsSidebar: [
    'intro',
    'getting-started',
    {
      type: 'category',
      label: 'vimpin (CLI)',
      collapsed: false,
      items: [
        'vimpin/overview',
        'vimpin/canonical-form',
        'vimpin/commands',
      ],
    },
    'vimpin-action',
    'vimpin-renovate-config',
    'faq',
  ],
};

export default sidebars;
