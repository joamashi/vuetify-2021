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
    <div class="video-container">
      <video autoplay="" muted="" playsinline="" data-source-fallback-landscape="https://developer.apple.com/wwdc21/videos/hero-landscape-large-2048x1152.mp4" data-source-fallback-portrait="/wwdc21/videos/hero-portrait-small.mov" src="https://developer.apple.com/wwdc21/videos/hero-portrait-small.mov">
        <source src="https://developer.apple.com/wwdc21/videos/hero-portrait-small.mov" media="(max-width: 735px) and (orientation: portrait)">
        <source src="https://developer.apple.com/wwdc21/videos/hero-landscape-small-1070x602.mp4" media="(max-width: 735px)">
        <source src="https://developer.apple.com/wwdc21/videos/hero-portrait-small.mov" media="(max-width: 1068px) and (orientation: portrait)">
        <source src="https://developer.apple.com/wwdc21/videos/hero-landscape-medium-1340x754.mp4" media="(max-width: 1068px)">
        <source src="https://developer.apple.com/wwdc21/videos/hero-landscape-large-2048x1152.mp4">
      </video>
    </div>
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
.container--fluid {
  height: 100%;
}

video, .endframe {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: top center;
  position: absolute;
  left: 0;
  top: 0;
}

.endframe {
  position: relative;
  left: 0;
  opacity: 0;
  transition: opacity 1s ease;
  background: url(https://developer.apple.com/wwdc21/images/endframe-landscape.jpg);
  background-size: cover;
  background-position: top center;
}

@media (max-width: 1068px) and (orientation: portrait) {
	.endframe {
		background-image: url('/wwdc21/images/endframe-portrait.jpg');
	}
}

.video-container {
    position: relative;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    background: #000000;
    will-change: opacity;
}

@media (max-width: 1068px) and (orientation: portrait) {
	.video-container {
		top: 52px;
	}
}
</style>