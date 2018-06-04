var Web3 = require('web3');


const cleanTitle = (str) => {
    return Web3.utils.toAscii(str.split('000')[0])
  }

export default cleanTitle
