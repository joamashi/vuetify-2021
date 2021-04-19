import klaytnService from '@/klaytn/klaytnService'

const state = {
  items: []
}

const getters = {
  allTodos: (state) => {
    return state.items
  }
}

const mutations = {
  setTodos (state, todos) {

    todos = todos.map(feed => {
      const obj = {
        todoId: parseInt(feed[0]),
        owner: feed[1],
        title: feed[2],
        photo: feed[3],
        timestamp: feed[4],
        isVerified: feed[5],
        verifier: feed[6]
      }
      return obj
    })
    
    state.items = todos
  }
}

const actions = {  
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}