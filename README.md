# FakeChair - Bachelor thesis Project

A conference management and review tool on the Ethereum testnet Rinkeby. 

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes. See deployment for notes on how to deploy the project on a live system.

### Prerequisites for local development

What things you need to install the software and how to install them.

Get the project:

```
$ git clone https://gitlab.gwdg.de/f.buschendorf/bachelor-thesis.git 
```

This Project uses the node packet manager:

```
$ sudo apt-get install npm 
```
The dapp is build using the dapp framework *Truffle*:

```
$ npm install -g truffle 
```

Install MetaMask, a browser add-on to interact with an Ethereum blockchain via dapps:

* [MetaMask](https://metamask.io/)


Download and install Ganache, a lokal Ethereum blockchain:

* [Ganache](http://truffleframework.com/ganache/)

Download and install IPFS, a peer-to-peer file storage system:

* [IPFS](https://ipfs.io/docs/getting-started/)

Go into the project folder, you will find ''package.json''. Install all dependencies. npm will look at the dependencies that are listed in that file and download the latest versions, using semantic versioning.

```
$ npm install
```

### Running

Start Ganache on port 7545.

Start IPFS daemon:

```
$ ipfs daemon 
```

**In project folder**

Compile and migrate contracts to lokal blockchain:

```
$ truffle migrate --reset 
```

Run node:

```
$ npm run start 
```



## Running the tests

There are only a few automated tests for this system.

```
truffle test
```


## Deployment



## Built With

* [Solidity](http://solidity.readthedocs.io/en/v0.4.24/) - Smart Contract programming language for Ethereum
* [react-js](https://reactjs.org/docs/hello-world.html) - The web framework used
* [npm](https://www.npmjs.com/) - Packet manager for JavaScript
* [truffle](http://truffleframework.com/) - Development framework for Ethereum (based on *react-box*)
* [web3.js](https://web3js.readthedocs.io/en/1.0/getting-started.html) - JavaScript library for Ethereum contract interaction
* [Bootstrap v4](https://getbootstrap.com/) - Front-end component library
* [react-jsonschema-form](https://github.com/mozilla-services/react-jsonschema-form) - Creating forms from JSON schemas


## Authors

* **Fabiola Buschendorf** [My Homepage](http://fabiolabuschendorf.com)


## License


## Some Code Sources

* [Origin Protocol](https://github.com/OriginProtocol/origin-js) - Well written Ethereum dapp
* [eth-ipfs](https://github.com/mcchan1/eth-ipfs) - Uploading files to IPFS + Ethereum + react
* [Truffle - Pet Shop](http://truffleframework.com/tutorials/pet-shop) - Getting started with truffle and smart contracts
* [ES6 - JavaScript Improves](https://de.udacity.com/course/es6-javascript-improved--ud356) - Udacity Tutorial on promises, async/await, ...

