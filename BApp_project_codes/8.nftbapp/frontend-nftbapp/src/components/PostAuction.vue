<template>
  <div>
    <v-form class="form" ref="form">      
      <v-text-field
      	v-model="tokenid"
      	></v-text-field>

        <v-text-field
            v-model="auction.auctionTitle"
            placeholder="e.g. My NFT"
            label="Auction title"
            persistent-hint
            ></v-text-field>

        <v-text-field
            v-model="auction.price"
            placeholder="e.g. 1"
            label="Price"
            type="number"
            persistent-hint
            ></v-text-field>

        <v-btn @click="createAuction" outlined color="teal">Create Auction</v-btn>
    </v-form>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
export default {
  props: ['tokenid', 'metadata'],

  data() {
    return {
      auction: {        
        auctionTitle: '',
        price: null        
      },
    }
  },

  computed: {
    ...mapGetters('wallet', [
      'klaytn',      
    ])
  },

  methods: {
    createAuction() {
      if(!this.tokenid) {
        alert("Check for tokenId")
        return
      }

      this.klaytn.createAuction(this.tokenid, this.auction.auctionTitle, this.metadata, this.auction.price, (receipt) => {
        alert(`Creation completed...! (#${receipt.blockNumber} ,${receipt.transactionHash})`)
      }, error => {
        alert(error)
      })      
    }    
  }
}
</script>