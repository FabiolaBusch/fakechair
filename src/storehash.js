import web3 from './web3'

// store IPFS hash
// address of contract, not transaction hash 
const address = '0xa41a4ffafcd4924945b51b91cf22ebcec6c759e2';

// in conference.json
const abi = [
    {
      "constant": true,
      "inputs": [
        {
          "name": "addr",
          "type": "address"
        },
        {
          "name": "roleName",
          "type": "string"
        }
      ],
      "name": "checkRole",
      "outputs": [],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [
        {
          "name": "addr",
          "type": "address"
        },
        {
          "name": "roleName",
          "type": "string"
        }
      ],
      "name": "hasRole",
      "outputs": [
        {
          "name": "",
          "type": "bool"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [],
      "name": "title",
      "outputs": [
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
          "name": "addr",
          "type": "address"
        },
        {
          "name": "roleName",
          "type": "string"
        }
      ],
      "name": "adminRemoveRole",
      "outputs": [],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [],
      "name": "id",
      "outputs": [
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
          "name": "addr",
          "type": "address"
        },
        {
          "name": "roleName",
          "type": "string"
        }
      ],
      "name": "adminAddRole",
      "outputs": [],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [],
      "name": "ipfsHash",
      "outputs": [
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
      "constant": true,
      "inputs": [],
      "name": "ROLE_ADMIN",
      "outputs": [
        {
          "name": "",
          "type": "string"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [],
      "name": "year",
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
          "type": "bytes32"
        }
      ],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "constructor"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "name": "addr",
          "type": "address"
        },
        {
          "indexed": false,
          "name": "roleName",
          "type": "string"
        }
      ],
      "name": "RoleAdded",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "name": "addr",
          "type": "address"
        },
        {
          "indexed": false,
          "name": "roleName",
          "type": "string"
        }
      ],
      "name": "RoleRemoved",
      "type": "event"
    },
    {
      "constant": false,
      "inputs": [
        {
          "name": "addr",
          "type": "address[]"
        }
      ],
      "name": "addAuthors",
      "outputs": [],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "constant": false,
      "inputs": [
        {
          "name": "addr",
          "type": "address[]"
        }
      ],
      "name": "addPCmembers",
      "outputs": [],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "constant": false,
      "inputs": [
        {
          "name": "addr",
          "type": "address"
        }
      ],
      "name": "removePCmember",
      "outputs": [],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "constant": false,
      "inputs": [
        {
          "name": "addr",
          "type": "address"
        }
      ],
      "name": "removeAuthor",
      "outputs": [],
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

  export default new web3.eth.Conference(abi, address);