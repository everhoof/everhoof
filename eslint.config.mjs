import { rhapsodic } from '@rhapsodic/eslint-config';

export default rhapsodic({
  ignores: ['public/**', '.pnpm-store/**', 'graphql/schema.ts'],
  vue: {
    a11y: true,
  },
  typescript: {
    parserOptions: {
      projectService: {
        allowDefaultProject: ['test/*.ts', 'tools/*.ts', 'types/*.ts'],
        defaultProject: '.nuxt/tsconfig.app.json',
      },
    },
  },
});
