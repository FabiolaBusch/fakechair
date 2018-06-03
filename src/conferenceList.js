import React from 'react'
import ConferenceRegistryContract from '../build/contracts/ConferenceRegistry.json'
import getWeb3 from './utils/getWeb3'
import Web3 from 'web3'
import multihash from './utils/multihash';
import Conference from './conference'

import Button from 'react-bootstrap/lib/Button';



class ConferenceList extends React.Component{

	constructor(props){
		super(props);
		this.state={
      web3: null,
			length: 0,
      searchTitle: "",
      searchYear: "",
      numChildren:0,

      newTitle: null,
      newYear:null,
      newIpfsHash: null, 
      newAddress: null
		};
	}

  componentWillMount() {
    // Get network provider and web3 instance.
    // See utils/getWeb3 for more info.

      getWeb3
      .then(results => {
        this.setState({
          web3: results.web3
        })

        // Instantiate contract once web3 provided.
        this.instantiateContract()
      })
      .catch(() => {
        console.log('Error finding web3.')
      })
  }


  /*
  Gets number of conferences.
   */
 instantiateContract() {

    const contract = require('truffle-contract')
    const conferenceRegistry = contract(ConferenceRegistryContract)
    conferenceRegistry.setProvider(this.state.web3.currentProvider)

    let conferenceRegistryInstance

    // Get accounts.
    this.state.web3.eth.getAccounts((error, accounts) => {
      conferenceRegistry.deployed().then((instance) => {
        conferenceRegistryInstance = instance

        // Gets number of conferences available
        return conferenceRegistryInstance.conferencesLength.call({from: accounts[0]})
      }).then((result) => {
        
        return this.setState({ length: result.c[0] })
      }).catch(function(err) {
      console.log(err);
    });
    })
  }

  /*
  Show the requested conference's details on button click.
   */
  showConf = async () =>  {

    const contract = require('truffle-contract')
    const conferenceRegistry = contract(ConferenceRegistryContract)
    conferenceRegistry.setProvider(this.state.web3.currentProvider)

    let conferenceRegistryInstance

    // Get accounts.
    this.state.web3.eth.getAccounts((error, accounts) => {
      conferenceRegistry.deployed().then((instance) => {
        conferenceRegistryInstance = instance
 
        return conferenceRegistryInstance.getConference(this.state.searchTitle, this.state.searchYear, {from: accounts[0]})
      }).then((result) => {
        //console.log(result)

        let address = result[0];
        let cleanTitle = Web3.utils.toAscii('0' + result[2].split('0')[1]); 
        let year = result[3].c[0];
        let hash = multihash.getMultihashFromContractResponse([result[4].toString(), result[5].c[0], result[6].c[0].toString()])
        //0x836bf7a28d737449f0669743052ccc3bca9a3eefbc80d58a7719ba6bae5c6006 18 32
        //console.log(cleanTitle)
        //console.log(hash.toString())

        return this.setState({newTitle: cleanTitle, newYear: year, newIpfsHash: hash, newAddress: address, numChildren: this.state.numChildren + 1})
      }).catch(function(err) {
      console.log(err);
    });
    })
  }

 

  /*
  Creates arbitrary number of conference Listings, depending on button-clicks.
   */
	render(){
    const children = [];

    for (var i = 0; i < this.state.numChildren; i += 1) {

      children.push( <Conference key={i} title={this.state.newTitle} year={this.state.newYear} hash={this.state.newIpfsHash} address={this.state.newAddress} />);
    };


		return(

			<div className="row">
        <p>Number of available conferences: {this.state.length}. </p>

        <input value={this.state.searchTitle} onChange={evt => this.setState({searchTitle: evt.target.value})} type="text" className="form-control" id="formGroupExampleInput" placeholder="Title"></input>
        <input value={this.state.yearchYear} onChange={evt => this.setState({searchYear: evt.target.value})} type="text" className="form-control" id="formGroupExampleInput" placeholder="Year"></input>

        <Button bsStyle="primary"  onClick={this.showConf}> Get Conference </Button>


        {children}
        
        
      </div>
		);
	}
}




export default ConferenceList