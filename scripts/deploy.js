/* eslint-disable no-console */
const ghPages = require('gh-pages');

ghPages.publish(
  './',
  {
    src: ['.nuxt/**/*', 'static/**/*', 'package.json', 'pnpm-lock.yaml', 'pnpm-workspace.yaml', 'tsconfig.json'],
    branch: 'dist',
  },
  (e) => {
    if (e) {
      console.error(e);
      process.exit(1);
    }
  },
);
