import React from 'react'
//import ConferenceRegistryContract from '../build/contracts/ConferenceRegistry.json'
import ConferenceContract from '../build/contracts/Conference.json'
import ipfs from './utils/ipfs';
import getWeb3 from './utils/getWeb3'
import multihash from './utils/multihash';

import Button from 'react-bootstrap/lib/Button';




class AddPaper extends React.Component{

	constructor(props){
		super(props);
		this.state={
      transactionHash: '',
      buffer:'',
      ipfsHash:'',
      conferenceAddress: "",
      title: "",
      web3: null
		};
	}

  componentWillMount() {
    getWeb3
    .then(results => {
      this.setState({
        web3: results.web3
      })

    })
    .catch(() => {
      console.log('Error finding web3.')
    })
  }

  captureFile =(event) => {
      event.stopPropagation()
      event.preventDefault()
      const file = event.target.files[0]
      let reader = new window.FileReader()
      reader.readAsArrayBuffer(file)
      reader.onloadend = () => this.convertToBuffer(reader)    
    };



  convertToBuffer = async(reader) => {
      //file is converted to a buffer for upload to IPFS
        const buffer = await Buffer.from(reader.result);
      //set this buffer -using es6 syntax
        this.setState({buffer});
    };

  addPaper = async () => {
    try{

      const contract = require('truffle-contract')
      let conference = contract(ConferenceContract);
      conference.setProvider(this.state.web3.currentProvider)

      // Get accounts.
      const accounts = await this.state.web3.eth.getAccounts() 

      // get conference instance
      const conferenceInstance = await conference.at(this.state.conferenceAddress)
        
      // Event emitted if transaction successful
      var events = conferenceInstance.PaperAdded();
      events.watch((error, result) => { 
        if(!error){
          return this.setState({alert: 'inline-block'})
        }
        else{
          console.error(error)
        }
      });

  
      // Add file to IPFS
      const ipfsHash = await ipfs.add(this.state.buffer)
      
      this.setState({ipfsHash: ipfsHash[0].hash })
      const { digest, hashFunction, size } = multihash.getBytes32FromMultiash(ipfsHash[0].hash);

      // Add Paper to Conference Contract
      const transactionHash = await conferenceInstance.addPaper(accounts[0], this.state.title , digest, hashFunction, size, { from: accounts[0] , gasLimit: 6385876})
      this.setState({transactionHash: transactionHash.tx})

      events.stopWatching();
    }
    catch(error){
      this.setState({transactionHash: 'Transaction failed. Only Authors can add papers to a conference.'})
      console.error(error)
    }
  }


	render(){
		return(

      <div className="container">

        <input value={this.state.title} onChange={evt => this.setState({title: evt.target.value})} type="text" className="form-control" id="formGroupExampleInput" placeholder="Title"></input>
        <input value={this.state.conferenceAddress} onChange={evt => this.setState({conferenceAddress: evt.target.value})} type="text" className="form-control" id="formGroupExampleInput" placeholder="Conference Address"></input>
      
        <input type="file" className="form-control-file" id="exampleFormControlFile1" onChange={this.captureFile}></input>
        <Button bsStyle="primary" type="submit" onClick={this.addPaper}> Add Paper </Button>

        <p>IPFS Hash: {this.state.ipfsHash} </p>
        <p>TX Hash: {this.state.transactionHash} </p>


      </div>

		);
	}
}


export default AddPaper