<template>
  <v-container fluid>
    <h1>Users Detail</h1>
    <p>유저 번호 : {{ userId }}</p>
    <v-btn
      @click="edit">수정</v-btn>
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
  methods: {
    edit() {
      // this.$router.push({ name: 'users-edit' })
      this.$router.push({ path: `${this.userId}/edit` })
    }
  },
}
</script>

<style lang="scss">

</style>