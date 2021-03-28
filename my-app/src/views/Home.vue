<template>
  <v-container fluid>
    Home
  </v-container>
</template>

<script>
export default {
  data: () => ({ 
  }),

  beforeRouteEnter (to, from, next) {
    console.log(to, from, next)
    console.log('before Route Enter!!')

    next()
  },
  beforeRouteLeave (to, from, next) {
    console.log(to, from, next)
    console.log('before Route Leave!!') // 떠나기 직전에 실행

    next()
  },
  
  created() {
    console.log('Home!!')
  },

  destroyed() {
    console.log('destroyed!!!!')
  },
}
</script>

<style lang="scss">

</style>