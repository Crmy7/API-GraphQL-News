// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: ["@nuxtjs/apollo"],

  apollo: {
    clients: {
      default: {
        httpEndpoint: "http://localhost:4000/graphql",
      },
    },
  },

  css: ['~/assets/scss/main.scss'],

  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },
  },

  compatibilityDate: "2025-01-02",
});