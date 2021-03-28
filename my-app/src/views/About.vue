<template>
  <v-container fluid>
    <!--
      Parameters : 값을 숨겨서 전달 가능
    -->
    <p>{{ userId }}</p>
    <p>{{ $route.params.size }}</p> <!-- hodx -->

    <!-- Query -->
    <p>{{ $route.query.group }}</p>
    <p>{{ $route.query.category }}</p>
    <router-link :to="{path: '/'}">Home</router-link>


    <v-flex xs12>
      <v-text-field
        v-model="userDetail"
        label="유저 검색"></v-text-field>
      <v-btn
        @click="$router.push({
          name: 'users-defail', 
          params: {
            ids: userDetail
          }
        })">검색</v-btn>
      <!-- @click="$router.push({path: `about/${ userDetail }`}) -->
    </v-flex>

    <v-flex xs12>
      <!-- 하위 경로 컨텐츠 -->
      <router-view></router-view>
    </v-flex>
  </v-container>
</template>

<script>
export default {
  data: () => ({
    userDetail: null,
  }),
  created() {
    console.log('Created') 
    console.log('router', this.$router)
    /**
      afterHooks: []
      app: Vue {_uid: 2, _isVue: true, $options: {…}, _renderProxy: Proxy, _self: Vue, …}
      apps: [Vue]
      beforeHooks: []
      fallback: false
      history: HTML5History {router: VueRouter, base: "", current: {…}, pending: null, ready: true, …}
      matcher: {match: ƒ, addRoute: ƒ, getRoutes: ƒ, addRoutes: ƒ}
      
      mode: "history"
      
      options: {mode: "history", base: "/", routes: Array(4)}
      resolveHooks: []
     */

    console.log('route', this.$route)
    /**
      fullPath: "/about/1"
      hash: ""
      matched: [{…}]
      meta: {}
      name: "about"
      params: {userId: "1"}
      path: "/about/1"
      query: {}
     */
  },
  computed: {
    userId() {
      return this.$route.params.userId
    }
  }
}
</script>

<style lang="scss">

</style>