import web3 from './web3'

// store IPFS hash
// address of contract, not transaction hash 
const address = '0xa2ccddf6cc2360454f2fde0e0f3ae8d9e187f090';

// in contract.json
const abi = [
    {
      "constant": false,
      "inputs": [
        {
          "name": "x",
          "type": "string"
        }
      ],
      "name": "sendHash",
      "outputs": [],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [],
      "name": "getHash",
      "outputs": [
        {
          "name": "x",
          "type": "string"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    }
  ]

// small letters, it's a function!!
export default new web3.eth.Contract(abi, address)

