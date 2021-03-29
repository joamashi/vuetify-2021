  
<template>
  <v-app id="inspire">
    <v-navigation-drawer
      v-model="drawer"
      fixed
      app>
      <v-list
        dense>
        <v-list-item
          v-for="item in items"
          :key="item.title"
          link
          router :to="{
            name: item.name, 
            params: {
              userId : item.params,
              size : item.qp,
            },
            query: item.query
          }" exact>
          <!-- 
            http://localhost:8080/about?group=member&category=trial%20
          -->

          <!-- 
            exact : 일치 했을때만 활성화
             
            @click="$router.push({ 
              path: item.path, 
              query: {}, 
              params:{}
            })"
          -->

          <v-list-item-content>
            <v-list-item-title>{{ item.title }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-app-bar 
      color="yellow"
      flat
      dense
      app>
      <v-app-bar-nav-icon
        @click="drawer = !drawer"></v-app-bar-nav-icon>
      <v-toolbar-title>Vuetify</v-toolbar-title>
    </v-app-bar>

    <v-main>
      <router-view></router-view>
    </v-main>
  </v-app>
</template>

<script>
export default {
  data: () => ({ 
    drawer: null,
    items: [
      { title: 'Home', name: 'home'},
      { 
        title: 'About', 
        name: 'about', 
        params: 4000, 
        qp: 'hodx',
        query: {
          group: 'member',
          category: 'trial '
        }
      },

      { title: 'Alerts', name: 'alerts'},
      { title: 'Cards', name: 'cards'},
    ],
  }),
}
</script>

<style lang="scss">
    
  // https://fonts.google.com/?subset=korean
  @import 'https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@100;300;400;500;700;900&display=swap';

  @import '@/scss/index';
</style>