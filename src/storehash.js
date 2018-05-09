const web3 = require('./web3');

// store IPFS hash
// address of contract, not transaction hash 
const address = '0xd8d5acee949dfb19a0ac07c9744d1357a62e872b';

// in conference.json
const abi = [
    {
      "constant": false,
      "inputs": [
        {
          "name": "x",
          "type": "uint256"
        }
      ],
      "name": "set",
      "outputs": [],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [],
      "name": "get",
      "outputs": [
        {
          "name": "",
          "type": "uint256"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    }
  ]

  export default new web3.eth.SimpleStorage(abi, address);