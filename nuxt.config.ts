export default defineNuxtConfig({
  compatibilityDate: '2026-09-25',
  modules: ['@pinia/nuxt', '@nuxtjs/i18n', '@nuxt/eslint'],
  css: [
    '~/assets/scss/normalize.scss',
    '~/assets/scss/grid.scss',
    '~/assets/scss/global.scss',
    '~/assets/scss/colors.scss',
    '~/assets/scss/page-shell.scss',
  ],
  app: {
    head: {
      title: 'Everhoof Radio',
      htmlAttrs: { class: 'page page_theme_dark page_theme_red' },
      bodyAttrs: { class: 'page__body grid grid_type_default' },
      link: [
        { rel: 'icon', type: 'image/png', href: '/favicon.png' },
        { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Open+Sans:wght@300;400;600;700;800&display=swap' },
      ],
    },
  },
  runtimeConfig: { public: { graphql: 'http://localhost:4000/graphql', audioBase: '' } },
  i18n: {
    locales: [
      { code: 'ru', name: 'Русский', language: 'ru-RU', file: 'ru-RU.js' },
      { code: 'en', name: 'English', language: 'en-US', file: 'en-US.js' },
    ],
    langDir: '../lang',
    defaultLocale: 'en',
    strategy: 'no_prefix',
    detectBrowserLanguage: { useCookie: true, cookieKey: 'i18n_redirected', alwaysRedirect: false, fallbackLocale: 'en' },
  },
});
