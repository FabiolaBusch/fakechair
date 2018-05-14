import web3 from './web3'

// store IPFS hash
// address of contract, not transaction hash 
const address = '0x0275bd9bad6f45874ffe10469e7e25c2b7578394';

// in contract.json
const abi = [
    {
      "constant": true,
      "inputs": [
        {
          "name": "",
          "type": "bytes32"
        }
      ],
      "name": "conferenceIndex",
      "outputs": [
        {
          "name": "",
          "type": "uint256"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [
        {
          "name": "",
          "type": "uint256"
        }
      ],
      "name": "conferences",
      "outputs": [
        {
          "name": "",
          "type": "address"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "name": "title",
          "type": "string"
        },
        {
          "indexed": false,
          "name": "year",
          "type": "uint256"
        },
        {
          "indexed": false,
          "name": "ipfsHash",
          "type": "bytes32"
        }
      ],
      "name": "ConferenceCreated",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "name": "title",
          "type": "string"
        },
        {
          "indexed": false,
          "name": "year",
          "type": "uint256"
        }
      ],
      "name": "ConferenceRemoved",
      "type": "event"
    },
    {
      "constant": true,
      "inputs": [],
      "name": "conferencesLength",
      "outputs": [
        {
          "name": "",
          "type": "uint256"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [
        {
          "name": "_title",
          "type": "string"
        },
        {
          "name": "_year",
          "type": "uint256"
        }
      ],
      "name": "getConference",
      "outputs": [
        {
          "name": "",
          "type": "address"
        },
        {
          "name": "",
          "type": "bytes32"
        },
        {
          "name": "",
          "type": "bytes32"
        },
        {
          "name": "",
          "type": "uint256"
        },
        {
          "name": "",
          "type": "bytes32"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    },
    {
      "constant": false,
      "inputs": [
        {
          "name": "_title",
          "type": "string"
        },
        {
          "name": "_year",
          "type": "uint256"
        },
        {
          "name": "_ipfsHash",
          "type": "string"
        }
      ],
      "name": "create",
      "outputs": [
        {
          "name": "",
          "type": "uint256"
        }
      ],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "constant": false,
      "inputs": [
        {
          "name": "_title",
          "type": "string"
        },
        {
          "name": "_year",
          "type": "uint256"
        }
      ],
      "name": "remove",
      "outputs": [
        {
          "name": "",
          "type": "uint256"
        }
      ],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "function"
    },
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
          "type": "bytes32"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    }
  ]
// small letters, it's a function!!
export default new web3.eth.Contract(abi, address)

