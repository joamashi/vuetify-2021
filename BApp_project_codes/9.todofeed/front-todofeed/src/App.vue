<template>
  <v-app>
    <v-app-bar app clipped-left dense>
      <v-toolbar-title>TodoFeed</v-toolbar-title>
      <v-spacer></v-spacer>
      <template v-if="isConnectWallet">
        <h3 class="mr-3">{{balance}} Klay</h3>
        <v-btn outlined @click="removeWallet">Remove Wallet</v-btn>
      </template>
      <template v-else>
        <v-btn outlined @click="showLoginBox = true">Connect to Wallet</v-btn>
      </template>
    </v-app-bar>
    <v-content>
      <v-container fluid>
        <v-btn color="blue darken-1" class="mb-3" v-if="isConnectWallet" @click="showWriteBox = true">New ToDo</v-btn>

        <Feeds v-on:verify="onVerify" />
      </v-container>
    </v-content>

    <v-dialog v-model="showLoginBox" max-width="500px">      
      <v-card>
        <v-card-title>
          <span class="headline">Login</span>
        </v-card-title>

        <LoginBox />

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" @click="showLoginBox = false">Close</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="showWriteBox" max-width="500px">
      <v-card>
        <v-card-title>
          <span class="headline">New Todo</span>
        </v-card-title>

        <WriteBox v-on:success-write="onSuccessWrite" v-on:error-validate="onErrorValidate" />

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" @click="showWriteBox = false">Close</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-snackbar
      v-model="snackbar" top>
      {{ snackbarMsg }}
      <v-btn
        color="pink"
        text
        @click="snackbar = false"
      >
        Close
      </v-btn>
    </v-snackbar>
  </v-app>
</template>

<script>

import { mapGetters, mapMutations } from 'vuex'
import KlaytnService from './klaytn/klaytnService'

import Feeds from '@/components/Feeds.vue'
import LoginBox from '@/components/LoginBox.vue'
import WriteBox from '@/components/WriteBox.vue'

export default {
  name: 'app',
  components: {
    Feeds,
    LoginBox,
    WriteBox
  },
  data: () => ({
    showLoginBox: false,
    showWriteBox: false,

    snackbar: false,
    snackbarMsg: ''
  }),
  computed: {
    ...mapGetters('wallet', [
      'klaytn',
      'isConnectWallet',
      'myaddress',
      'balance'
    ])
  },
  async mounted () {
    await this.connect()

    this.getFeeds()
  },

  methods: {
    ...mapMutations('wallet', [
      'setKlaytn',
      'setIsConnectWallet',
      'setMyAddress',
      'setBalance'
    ]),
    ...mapMutations('todos', [
      'setTodos'
    ]),
    async connect () {
      const klaytn = new KlaytnService()
      this.setKlaytn(klaytn)
      const address = await klaytn.init()      

      if (address) {
        this.setMyAddress(address)

        this.getBalance()
        this.setIsConnectWallet(true)
      } else {
        this.setIsConnectWallet(false)
      }
    },
    async getBalance () {
      if (this.myaddress) {
        const balance = await this.klaytn.getBalance(this.myaddress)
        this.setBalance(balance)
      }
    },
    removeWallet () {
      this.klaytn.removeWallet()
      this.setIsConnectWallet(false)
    },

    onErrorValidate(msg) {
      this.snackbarMsg = msg
      this.snackbar = true
    },

    onSuccessWrite(msg) {
      this.snackbarMsg = msg
      this.snackbar = true

      this.getFeeds()      

      this.showWriteBox = false
    },

    onVerify(todoId) {
      this.klaytn.verify(todoId, (receipt) => {        
        this.snackbarMsg = `Complete.. blocknumber: #${receipt.blockNumber} , ${receipt.transactionHash}`
        this.snackbar = true

        this.getFeeds()        
      })
    },

    getFeeds() {
      this.klaytn.getFeeds((feed) => {
        this.setTodos(feed)
      })

      this.getBalance()
    }
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
