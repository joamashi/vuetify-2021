<template>
<div>
  <h2>Connect to Wallet</h2>
  <v-card class="d-flex mx-auto mb-4 pa-2">    
    <template v-if="walletInstance">
      <v-container>
        <v-row>
          <v-col cols="16">
            <h2>Integrated</h2>
            <div class="address">{{walletInstance.address}}</div>
            <v-btn outlined class="btnSubmit mt-3" @click="this.handleRemoveWallet">REMOVE WALLET</v-btn>
          </v-col>
        </v-row>
      </v-container>
    </template>
    <template v-else>
      <v-container>
        <v-row>
          <v-col cols="16">
            <input type="file" v-on:change="this.handleImport" />
            <v-text-field
              v-model="password"
              label="Password"
              type="password"
              solo
              required
            ></v-text-field>

            <v-divider class="mt-3 mb-3"></v-divider>

            <v-text-field
              v-model="privateKey"
              label="Private Key"
              type="password"
              solo
              required
            ></v-text-field>

            <v-btn outlined class="btnSubmit" @click="this.handleAddWallet">ADD WALLET</v-btn>
          </v-col>
        </v-row>
      </v-container>
    </template>
  </v-card>
  
  <v-snackbar
    v-model="snackbar" top>
    {{ errorTxt }}
    <v-btn
      color="pink"
      text
      @click="snackbar = false"
    >
      Close
    </v-btn>
  </v-snackbar>
</div>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex'

export default {
  data: () => ({
    snackbar: false,
    errorTxt: '',
    
    keystore: null,
    password: '',
    privateKey: null,
    walletInstance: null
  }),
  computed: {
    ...mapGetters('wallet', [
      'klaytn'
    ])
  },
  methods: {
    ...mapMutations('wallet', [ 
      'setIsConnectWallet',
      'setMyAddress',
      'setBalance'
    ]),    

    handleImport (e) {
      const keystore = e.target.files[0]
      
      const fileReader = new FileReader()
      fileReader.onload = (e) => {
        try {
          if (!this.checkValidKeystore(e.target.result)) {            
            this.errorTxt = 'Invalid keystore file.'
            this.snackbar = true
            return
          }

          this.keystore = e.target.result
                  
        } catch (e) {
          this.errorTxt = 'Invalid keystore file.'
          this.snackbar = true
          return
        }
      }
      fileReader.readAsText(keystore)
    },

    async handleAddWallet () {
      try {        
        if(this.privateKey) {
          await this.klaytn.integrateWallet(this.privateKey)          
        } else {          
          await this.klaytn.loginWithKeystore(this.keystore, this.password)
        }
        this.getWalletInfo()
      } catch (e) {        
        this.errorTxt = `Password or private key doesn't match.`
        this.snackbar = true
      }
    },

    async getWalletInfo () {
      this.walletInstance = this.klaytn.getWallet() 
      const address = this.walletInstance.address
      if(address) {
        this.setMyAddress(address)
        const balance = await this.klaytn.getBalance(address)
        this.setBalance(balance)
        this.setIsConnectWallet(true)
      } else {
        this.setIsConnectWallet(false)
      }
    },

    checkValidKeystore (keystore) {
      const parsedKeystore = JSON.parse(keystore)
      const isValidKeystore = parsedKeystore.version &&
        parsedKeystore.id &&
        parsedKeystore.address &&
        parsedKeystore.crypto

      return isValidKeystore
    },

    async handleRemoveWallet () {
      this.klaytn.removeWallet()
      this.setIsConnectWallet(false)
      this.walletInstance = null
    }
  },
  mounted () {
    if(this.klaytn) {
      this.walletInstance = this.klaytn.getWallet()
    }    
  }
}

</script>

<style scoped>


</style>