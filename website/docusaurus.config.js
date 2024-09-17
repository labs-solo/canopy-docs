// docusaurus.config.js

import { themes as prismThemes } from 'prism-react-renderer';

module.exports = {
  title: 'Canopy Documentation',
  tagline: 'Empowering DeFi Projects and Asset Owners',
  url: 'https://labs-solo.github.io', // Your website URL
  baseUrl: '/canopy-docs/', // Base URL for your project
  onBrokenLinks: 'warn', // Change this to 'warn' temporarily
  onBrokenMarkdownLinks: 'warn',
  favicon: 'img/favicon.ico', // Place your favicon in static/img

  // GitHub pages deployment config.
  organizationName: 'labs-solo', // Usually your GitHub org/user name.
  projectName: 'canopy-docs', // Usually your repo name.
  deploymentBranch: 'gh-pages', // The branch that GitHub Pages uses.

  // If you plan to use GitHub Pages for deployment:
  trailingSlash: false,

  themeConfig: {
    navbar: {
      title: 'Canopy',
      logo: {
        alt: 'Canopy Logo',
        src: 'img/logo.svg', // Place your logo in static/img
      },
      items: [
        {
          type: 'doc',
          docId: 'introduction/overview',
          position: 'left',
          label: 'Docs',
        },
        // Uncomment the following line if you have a blog
        // { to: '/blog', label: 'Blog', position: 'left' },
        {
          href: 'https://github.com/labs-solo/canopy-docs',
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
              label: 'Overview',
              to: '/docs/introduction/overview',
            },
          ],
        },
        {
          title: 'Community',
          items: [
            {
              label: 'Discord',
              href: '#', // Add your Discord invite link
            },
            {
              label: 'Twitter',
              href: '#', // Add your Twitter profile link
            },
          ],
        },
        {
          title: 'More',
          items: [
            // Uncomment the following line if you have a blog
            // { label: 'Blog', to: '/blog' },
            {
              label: 'GitHub',
              href: 'https://github.com/labs-solo/canopy-docs',
            },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} Canopy.`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
    },
  },

  presets: [
    [
      '@docusaurus/preset-classic',
      {
        docs: {
          sidebarPath: require.resolve('./sidebars.js'),
          routeBasePath: '/', // This makes docs appear at the root
        },
        blog: false, // Set to false if you don't have a blog
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      },
    ],
  ],
};
