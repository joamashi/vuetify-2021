import { cav, getContractInstance } from './caver'

export default class KlaytnService {

  constructor() {}

  async init () {
    const walletFromSession = sessionStorage.getItem('walletInstance')
    
    if (walletFromSession) {
      try {
        const address = JSON.parse(walletFromSession).address
        cav.klay.accounts.wallet.add(JSON.parse(walletFromSession))        
        
        return address
      } catch (e) {        
        sessionStorage.removeItem('walletInstance')
        return false
      }
    }
  }

  async getBlockNumber () {  	
    const blockNumber = await cav.klay.getBlockNumber()
    return blockNumber
  }

  async getBalance (address) {
    const balance = await cav.klay.getBalance(address)    
    return cav.utils.fromPeb(balance, "KLAY")
  }

  async loginWithKeystore (keystore, password) {  	
    const { privateKey: privateKeyFromKeystore } = cav.klay.accounts.decrypt(keystore, password)    
    await this.integrateWallet(privateKeyFromKeystore)
    return true
  }

  integrateWallet (privateKey) {
    const walletInstance = cav.klay.accounts.privateKeyToAccount(privateKey)
    cav.klay.accounts.wallet.add(walletInstance)
    sessionStorage.setItem('walletInstance', JSON.stringify(walletInstance))
    return true
  }
 
  removeWallet () {
    cav.klay.accounts.wallet.clear()
    sessionStorage.removeItem('walletInstance')
    return true
  }

  getWallet () {
    if (cav.klay.accounts.wallet.length) {
      return cav.klay.accounts.wallet[0]
    }
    return null
  }

  writeTodo (title, file, dispatch, errorCb) {
    const walletInstance = cav.klay.accounts.wallet && cav.klay.accounts.wallet[0]
 
    if (!walletInstance) {
      console.log('no walletInstance')
      return
    }

    const address = walletInstance.address

    const reader = new window.FileReader()
    reader.readAsArrayBuffer(file)
    reader.onloadend = () => {
      const buffer = Buffer.from(reader.result)
      const hexString = "0x" + buffer.toString('hex')
      getContractInstance().methods.writeTodo(title, hexString).send({
        from: address,
        gas: '100000000',
      })
      .once('transactionHash', (txHash) => {
        console.log(`
          Sending a transaction...
          txHash: ${txHash}
          `
        )
      })
      .once('receipt', (receipt) => {
        console.log(`
          Received receipt! (#${receipt.blockNumber} ,${receipt.transactionHash})
        `, receipt)

        dispatch(receipt)
      })
      .once('error', (error) => {
        errorCb(error.message)
      })
    }
  }


  getFeeds (dispatch) {
    getContractInstance().methods.getTotalTodoCount().call()
    .then((totalTodoCount) => {
      if (!totalTodoCount) return []
      const feed = []
      for (let i = totalTodoCount; i > 0; i--) {
        const todo = getContractInstance().methods.getTodo(i).call()
        feed.push(todo)
      }
      return Promise.all(feed)
    })
    .then((feed) => {      
      dispatch(feed)
    })
  }

  verify (todoId, dispatch) {
    const walletInstance = cav.klay.accounts.wallet && cav.klay.accounts.wallet[0]

    if (!walletInstance) {
      console.log('no walletInstance')
      return
    } 

    const address = walletInstance.address
    getContractInstance().methods.verifyTodo(todoId).send({
      from: address,
      gas: '3000000'
    })
    .once('transactionHash', (txHash) => {
      console.log(`
        Sending a transaction...
        txHash: ${txHash}
        `
      )
    })
    .once('receipt', (receipt) => {
      console.log(`
        Received receipt! (#${receipt.blockNumber} ,${receipt.transactionHash})
      `, receipt)

      dispatch(receipt)
    })
    .once('error', (error) => {
      alert(error.message)
    })
  }

}