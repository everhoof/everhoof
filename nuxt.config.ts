export default {
  /*
   ** Headers of the page
   */
  head: {
    title: process.env.npm_package_name || '',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      {
        hid: 'description',
        name: 'description',
        content: process.env.npm_package_description || '',
      },
    ],
    link: [
      { rel: 'icon', type: 'image/png', href: '/favicon.png' },
      {
        rel: 'stylesheet',
        href:
          'https://fonts.googleapis.com/css2?family=Open+Sans:ital,wght@0,300;0,400;0,600;0,700;0,800;1,300;1,400;1,600;1,700;1,800&display=swap',
      },
    ],
    script: [{ src: '/js/set.min.js' }, { src: '/js/ie11vars.min.js' }, { src: '/js/svgxuse.min.js' }],
    htmlAttrs: {
      class: ['page page_theme_dark page_theme_red'],
    },
    bodyAttrs: {
      class: ['page__body grid grid_type_default'],
    },
  },
  /*
   ** Customize the progress-bar color
   */
  loading: { color: '#fff' },
  /*
   ** Global CSS
   */
  css: [],
  styleResources: {
    stylus: ['~/assets/stylus/variables.styl', '~/assets/stylus/mixins.styl'],
  },
  /*
   ** Plugins to load before mounting the App
   */
  plugins: [
    {
      src: '~/plugins/nuxt-client-init.client.ts',
      ssr: false,
    },
    {
      src: '~/plugins/polyfills.ts',
      ssr: false,
    },
  ],
  /*
   ** Nuxt.js dev-modules
   */
  buildModules: [
    '@nuxtjs/eslint-module',
    '@nuxt/typescript-build',
    ['@nuxtjs/dotenv', { filename: process.env.NODE_ENV === 'production' ? '.env.production' : '.env' }],
    '@nuxtjs/router',
    '@nuxtjs/style-resources',
    'nuxt-typed-vuex',
  ],
  /*
   ** Nuxt.js modules
   */
  modules: [
    // Doc: https://github.com/nuxt-community/dotenv-module
    'cookie-universal-nuxt',
    '@nuxtjs/svg-sprite',
    '@nuxtjs/apollo',
    [
      'nuxt-i18n',
      {
        locales: [
          {
            code: 'ru',
            name: 'Русский',
            iso: 'ru-RU',
            file: 'ru-RU.js',
          },
          {
            code: 'ru',
            name: 'English',
            iso: 'en-US',
            file: 'en-US.js',
          },
        ],
        lazy: true,
        langDir: 'lang/',
        defaultLocale: 'ru',
        strategy: 'no_prefix',
        detectBrowserLanguage: {
          useCookie: true,
          cookieKey: 'i18n_redirected',
          alwaysRedirect: false,
          fallbackLocale: 'ru',
        },
      },
    ],
  ],
  /*
   ** Build configuration
   */
  build: {
    transpile: [/typed-vuex/],
  },
  svgSprite: {
    input: '~/assets/icons/',
  },
  apollo: {
    clientConfigs: {
      default: '~/config/apollo.ts',
    },
  },
  router: {
    middleware: ['authenticated'],
  },
};
