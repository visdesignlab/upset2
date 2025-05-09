import { themes as prismThemes } from 'prism-react-renderer';
import type { Config } from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

const config: Config = {
  title: 'UpSet 2.0',
  tagline: 'Interactive Set Visualization',
  url: 'https://upset.multinet.app',
  favicon: 'img/favicon.ico',
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  baseUrl: '/upset2/',

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: 'visdesignlab', // Usually your GitHub org/user name.
  projectName: 'upset2', // Usually your repo name.

  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',

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
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          editUrl:
            'https://github.com/visdesignlab/upset2/edit/main/packages/userdocs/',
        },
        // blog: {
        //   showReadingTime: true,
        //   feedOptions: {
        //     type: ['rss', 'atom'],
        //     xslt: true,
        //   },
        //   // Please change this to your repo.
        //   // Remove this to remove the "edit this page" links.
        //   editUrl:
        //     'https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/',
        //   // Useful options to enforce blogging best practices
        //   onInlineTags: 'warn',
        //   onInlineAuthors: 'warn',
        //   onUntruncatedBlogPosts: 'warn',
        // },
        theme: {
          customCss: './src/css/custom.css',
        },
      } satisfies Preset.Options,
    ],
  ],

  themeConfig: {
    // TODO: Replace with social card
    image: 'img/docusaurus-social-card.jpg',
    navbar: {
      title: 'UpSet 2.0',
      logo: {
        alt: 'UpSet Logo',
        src: 'img/upset_logo.svg',
      },
      items: [
        {
          type: 'docSidebar',
          sidebarId: 'tutorialSidebar',
          position: 'left',
          label: 'Documentation',
        },

        { to: 'about', label: 'About', position: 'left' },
        {
          href: 'https://upset.multinet.app',
          label: 'Go To UpSet',
          position: 'right',
        },
        {
          href: 'https://github.com/visdesignlab/upset2',
          label: 'GitHub',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'light',
      links: [
        {
          html: ` 
              <div class="footer-wrapper row">
                <a class="col " target="_blank" href="https://vdl.sci.utah.edu/">
                    <img src="./img/vdl-logo-light.svg" class='logo light-theme-display-component'/>
                    <img src="./img/vdl-logo-dark.svg" class='logo dark-theme-display-component'/>
                </a>
                <a class="col " target="_blank" href="https://www.sci.utah.edu/">
                  <img src="./img/sci-logo-light.svg" class='logo light-theme-display-component'/>
                  <img src="./img/sci-logo-dark.svg" class='logo dark-theme-display-component'/>
                </a>
                <a class="col " target="_blank" href="https://www.cs.utah.edu/">
                  <img src="./img/ULogo-light.svg" class='logo light-theme-display-component'/>
                  <img src="./img/ULogo-dark.svg" class='logo dark-theme-display-component'/>
                </a>
                <a class="col " target="_blank" href="https://chanzuckerberg.com/">
                  <img src="./img/czi-logo.svg" class='logo'/>
                </a>                                                       
              </div>
            `,
        },
      ],
      // copyright: `Copyright © ${new Date().getFullYear()} UpSet 2.0, VisDesignLab. Built with Docusaurus.`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
