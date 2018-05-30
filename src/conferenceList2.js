import React from 'react'
import ConferenceRegistryContract from '../build/contracts/ConferenceRegistry.json'
import getWeb3 from './utils/getWeb3'



class ConferenceList2 extends React.Component{

	constructor(props){
		super(props);
		this.state={
			length: 0,
      web3: null
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

 instantiateContract() {
    /*
     * SMART CONTRACT EXAMPLE
     *
     * Normally these functions would be called in the context of a
     * state management library, but for convenience I've placed them here.
     */

    const contract = require('truffle-contract')
    const conferenceRegistry = contract(ConferenceRegistryContract)
    conferenceRegistry.setProvider(this.state.web3.currentProvider)

    // Declaring this for later so we can chain functions on SimpleStorage.
    var conferenceRegistryInstance

    // Get accounts.
    this.state.web3.eth.getAccounts((error, accounts) => {
      conferenceRegistry.deployed().then((instance) => {
        conferenceRegistryInstance = instance

        // Stores a given value, 5 by default.
        return conferenceRegistryInstance.conferencesLength.call({from: accounts[0]})
      }).then((result) => {
        // Get the value from the contract to prove it worked.
        return this.setState({ length: result.c[0] })
      })
    })
  }


 /* getLength() {
    const contract = require('truffle-contract')
    const conferenceReg = contract(ConferenceRegistryContract)
    conferenceReg.setProvider(this.state.web3.currentProvider)

    // Get accounts.
    this.state.web3.eth.getAccounts((error, accounts) => {
      conferenceReg.deployed().then((instance) => {
        this.conferenceRegInst = instance

        return this.conferenceRegInst.conferencesLength.call({from: accounts[0]});
        }).catch(function(err) {
      console.log(err.message);
    });
    })
  }*/

/*  getAllConferences() {
    const contract = require('truffle-contract')
    const conferenceReg = contract(ConferenceRegistryContract)
    conferenceReg.setProvider(this.state.web3.currentProvider)

    // Get accounts.
    this.state.web3.eth.getAccounts((error, accounts) => {
      conferenceReg.deployed().then((instance) => {
        this.conferenceRegInst = instance

        return this.conferenceRegInst.getAllConferences.call({from: accounts[0]});
        }).catch(function(err) {
      console.log(err.message);
    });
    })
  }*/




	render(){
		return(

			<div className="row">
        Number of available conferences: {this.state.length}
      </div>
		);
	}
}


export default ConferenceList2