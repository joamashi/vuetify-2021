import Caver from 'caver-js'

const deployedABI = require('./deployedABI.json')

const TEST_NET = 'https://api.baobab.klaytn.net:8651'

export const config = {
  rpcURL: TEST_NET
}

const DEPLOYED_ADDRESS = '0xa47898be53fba0fecdb9b4e1dadea5bf0f3c77f7' // testnet

const cav = new Caver(config.rpcURL)

const getContractInstance = () => {  
  const contractInstance = deployedABI
  && DEPLOYED_ADDRESS
  && new cav.klay.Contract(deployedABI, DEPLOYED_ADDRESS)
  return contractInstance
}

export {cav, getContractInstance}
