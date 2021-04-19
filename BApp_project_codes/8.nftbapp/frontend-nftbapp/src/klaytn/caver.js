import Caver from 'caver-js'

const AuctionsABI = require('@/contracts/Auctions.json').abi
const MyNFTABI = require('@/contracts/MyNFT.json').abi

const TEST_NET = 'https://api.baobab.klaytn.net:8651'

export const config = {
  rpcURL: TEST_NET
}

const MYNFT_CA = '0xfd0d9aeaae3c10b1acd9db5a17f2ee2775493f64'
const AUCTIONS_CA = '0x3a235ca1b8d08f2f5d6607f8b9f4fa33f540fed6'

const cav = new Caver(config.rpcURL)

const getMyNFTInstance = () => {  
  const contractInstance = MyNFTABI
  && MYNFT_CA
  && new cav.klay.Contract(MyNFTABI, MYNFT_CA)
  return contractInstance
}

const getAuctionsInstance = () => {
  const contractInstance = AuctionsABI
  && AUCTIONS_CA
  && new cav.klay.Contract(AuctionsABI, AUCTIONS_CA)
  return contractInstance
}

export {cav, MYNFT_CA, AUCTIONS_CA, getMyNFTInstance, getAuctionsInstance}
