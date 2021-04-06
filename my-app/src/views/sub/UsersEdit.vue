<template>
  <v-container fluid>
    <h1>Users Edit</h1>
    <p>{{ userId }}</p>
  </v-container>
</template>

<script>
export default {
  data: () => ({ 
  }),
  created() {
  },
  computed: {
    userId() {
      return this.$route.params.ids
    }
  },
}
</script>

<style lang="scss">

</style>