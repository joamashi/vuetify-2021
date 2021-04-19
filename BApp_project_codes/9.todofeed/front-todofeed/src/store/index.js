import Vue from 'vue'
import Vuex from 'vuex'

import wallet from '@/store/modules/wallet'
import todos from '@/store/modules/todos'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
  	wallet,
    todos
  }
})
