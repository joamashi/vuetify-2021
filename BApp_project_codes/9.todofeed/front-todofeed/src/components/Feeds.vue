<template>
<div>
  <v-card class="cardContent mx-auto mb-4" max-width="400" max-height="400"
    v-for="item in allTodos" :key="item.index">
    <v-list-item>
      <v-list-item-avatar color="grey"><img :src="getProfile(item.owner)" /></v-list-item-avatar>
      <v-list-item-content>
        <v-list-item-title>{{item.title}}</v-list-item-title>
        <v-list-item-subtitle>{{getCreatedAt(item.timestamp)}}</v-list-item-subtitle>
      </v-list-item-content>
      <div class="flex-grow-1"></div>
      <a :href="getScopeUrl(item.verifier)" target="_blank">{{getVerified(item.isVerified)}}</a>
    </v-list-item>

    <v-img
      :src="getImage(item.photo)"
      height="194"
    ></v-img>    

    <v-card-actions>
      <v-btn
        text
        color="deep-purple accent-4"
        v-if="!item.isVerified"
        @click="verify(item.todoId)"
      >
        Verify
      </v-btn>
    </v-card-actions>
  </v-card>
</div>  
</template>

<script>
import { mapGetters } from 'vuex'
import moment from 'moment'
import {getIdenticon} from '@/util/identicon'
import { drawImageFromBytes } from '@/util/imageUtils'

export default {
  computed: {
    ...mapGetters('todos', [
      'allTodos'
    ])
  },

  methods: {
    getProfile (user_name) {
      return getIdenticon(user_name)      
    },    
    getCreatedAt (timestamp) {      
      return moment(timestamp * 1000).fromNow()
    },
    getImage (photo) {
      if (photo) {
        const imageUrl = drawImageFromBytes(photo)
        return imageUrl
      } else {
        ''
      }
    },
    getVerified (isVerified) {
      return (isVerified) ? "Verified" : "Not Verified"
    },
    getScopeUrl (address) {
      if (address) {
        return `https://baobab.scope.klaytn.com/account/${address}`  
      } else {
        return ''
      }      
    },
    verify (todoId) {
      this.$emit('verify', todoId)
    }
  }
  
}
</script>

<style scoped>
.cardContent {
  text-align: left;
}

.v-list-item__title {
  font-size: 14px;
  font-weight: normal;
  font-stretch: normal;
  font-style: normal;
  line-height: normal;
  letter-spacing: normal;
  color: #17191d;
}

.v-list-item__subtitle {
  font-size: 12px;
  font-weight: normal;
  font-stretch: normal;
  font-style: normal;
  line-height: normal;
  letter-spacing: normal;
  color: #7f899a;
}
</style>