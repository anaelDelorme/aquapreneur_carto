import { defineNuxtConfig } from 'nuxt/config'

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  typescript: {
    typeCheck: true
  },
  css: [
    '@gouvfr/dsfr/dist/dsfr.min.css',
    '@gouvfr/dsfr/dist/utility/icons/icons.min.css',
    '@gouvminint/vue-dsfr/styles',
  ],
  ignore: [
    '**/*.test.*',
    '**/*.spec.*',
    '**/*.cy.*',
  ],
  srcDir: 'client/',
  modules: ['nuxt-icon','nuxt3-leaflet', 'nuxt-mapbox'],
  mapbox: {
    accessToken: 'pk.eyJ1IjoiYW5hZWxkZWxvcm1lIiwiYSI6ImNscTI1eHI1bjAwcHQyam5zNXEzbG9sNDUifQ.OplU3wX4w6Thg2ZKomWZ9A'
  }
})
