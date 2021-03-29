<template>
  <v-container fluid>
    <h1 class="Noto">Container</h1>
    <h1 class="Roboto">Container</h1>
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
  .Noto {
    font-family: 'Noto Sans KR', serif;
    font-weight: 700;
  }
  .Roboto {
    font-family: 'Roboto', serif;
    font-weight: 700;
  }
</style>