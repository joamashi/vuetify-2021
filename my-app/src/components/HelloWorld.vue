<template>
  <v-container>
    <v-row class="text-center">
      <v-col cols="12">
        <v-img
          :src="require('../assets/logo.svg')"
          class="my-3"
          contain
          height="200" />
      </v-col>

      <v-col
        class="mb-5"
        cols="12">
        <h2 class="headline font-weight-bold mb-3">What's next?</h2>

        <v-row justify="center">
          <a
            v-for="(next, i) in whatsNext"
            :key="i"
            :href="next.href"
            class="subheading mx-3"
            target="_blank">
            {{ next.text }}
          </a>
        </v-row>
      </v-col>
    </v-row>

    <v-alert type="success">I'm an Alert Usage Example</v-alert>
  </v-container>
</template>

<script>
export default {
  name: 'HelloWorld',

  data: () => ({
    ecosystem: [
      {
        text: 'vuetify-loader',
        href: 'https://github.com/vuetifyjs/vuetify-loader',
      },
      {
        text: 'github',
        href: 'https://github.com/vuetifyjs/vuetify',
      },
      {
        text: 'awesome-vuetify',
        href: 'https://github.com/vuetifyjs/awesome-vuetify',
      },
    ],
    importantLinks: [
      {
        text: 'Documentation',
        href: 'https://vuetifyjs.com',
      },
      {
        text: 'Chat',
        href: 'https://community.vuetifyjs.com',
      },
      {
        text: 'Made with Vuetify',
        href: 'https://madewithvuejs.com/vuetify',
      },
      {
        text: 'Twitter',
        href: 'https://twitter.com/vuetifyjs',
      },
      {
        text: 'Articles',
        href: 'https://medium.com/vuetify',
      },
    ],
    whatsNext: [
      {
        text: 'Explore components',
        href: 'https://vuetifyjs.com/components/api-explorer',
      },
      {
        text: 'Select a layout',
        href: 'https://vuetifyjs.com/getting-started/pre-made-layouts',
      },
      {
        text: 'Frequently Asked Questions',
        href: 'https://vuetifyjs.com/getting-started/frequently-asked-questions',
      },
    ],

    isMobile: false,
  }),

  computed: {
    // height () {
    //   switch (this.$vuetify.breakpoint.name) {
    //     case 'xs': return 220
    //     case 'sm': return 400
    //     case 'md': return 500
    //     case 'lg': return 600
    //     case 'xl': return 800
    //   }
    // },
  },

  beforeDestroy () {
      if (typeof window === 'undefined') return;
      window.removeEventListener('resize', this.onResize, { passive: true });
    },

    mounted () {
      this.onResize();
      window.addEventListener('resize', this.onResize, { passive: true });
    },

    methods: {
      onResize () {
        this.isMobile = window.innerWidth < 600;
      },
    },
}
</script>
