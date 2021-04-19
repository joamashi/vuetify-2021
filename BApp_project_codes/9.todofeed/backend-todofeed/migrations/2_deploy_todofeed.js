
const TodoFeed = artifacts.require('./TodoFeed.sol')
const fs = require('fs')
module.exports = function (deployer) {
  deployer.deploy(TodoFeed)
  .then(() => {
  if (TodoFeed._json) {
  fs.writeFile(
    'deployedABI',
    JSON.stringify(TodoFeed._json.abi, 2),
    (err) => {
      if (err) throw err
      console.log(`The abi of ${TodoFeed._json.contractName} is recorded on deployedABI file`)
    })
}
fs.writeFile(
  'deployedAddress',
  TodoFeed.address,
    (err) => {
      if (err) throw err
      console.log(`The deployed contract address * ${TodoFeed.address} * is recorded on deployedAddress file`)
    })
  })
}
