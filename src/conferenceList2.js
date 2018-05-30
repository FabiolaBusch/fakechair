import React from 'react'
import ConferenceRegistryContract from '../build/contracts/ConferenceRegistry.json'
import getWeb3 from './utils/getWeb3'
import Web3 from 'web3'
import multihash from './utils/multihash';

import Button from 'react-bootstrap/lib/Button';
import Table from 'react-bootstrap/lib/Table';



class ConferenceList2 extends React.Component{

	constructor(props){
		super(props);
		this.state={
			length: 0,
      web3: null,
      confJSON: null,
      title: null
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
      }).then((result) => {

        return conferenceRegistryInstance.getConferenceByIndex(this.state.length-1, {from: accounts[0]})
      }).then((result) => {
          // Update state with the result.
       
        this.setState({ title: result[2] })

        let cleanTitle = Web3.utils.toAscii('0' + result[2].split('0')[1]); 
        //let year = result[3].c[0]
        let ipfshash = multihash.getMultihashFromContractResponse([result[4].toString(), result[5].c[0], result[6].c[0].toString()])

        console.log(cleanTitle)
        console.log(ipfshash.toString())

        //console.log(result[4])
        //console.log(result[5].c[0].toString())
        //console.log(result[6].c[0])


      }).catch(function(err) {
      console.log(err);
    });
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

/*  getConference() {
    const contract = require('truffle-contract')
    const conferenceReg = contract(ConferenceRegistryContract)
    conferenceReg.setProvider(this.state.web3.currentProvider)
    let conferenceRegInst

    // Get accounts.
    this.state.web3.eth.getAccounts((error, accounts) => {
      conferenceReg.deployed().then((instance) => {
        conferenceRegInst = instance

        return conferenceRegInst.getConferenceByIndex(0, {from: accounts[0]})
        }).then((result) => {
          // Update state with the result.
          console.log(result)
        }).catch(function(err) {
      console.log(err.message);
    });
    })
  }*/

  /*
  <Table bordered responsive>
          <thead>
            <tr>
              <th>Type</th>
              <th>Value</th>
            </tr>
          </thead>
         
          <tbody>
            <tr>
              <td>Title</td>
              <td>{this.state.confJSON[2]}</td>
            </tr>
            <tr>
              <td>Year</td>
              <td>{this.state.confJSON[3].c[0]}</td>
            </tr>

            <tr>
              <td>Digest</td>
              <td>{this.state.confJSON[4]}</td>
            </tr>

            <tr>
              <td>Hash Function</td>
              <td>{this.state.confJSON[5].c[0]}</td>
            </tr>

            <tr>
              <td>Size</td>
              <td>{this.state.confJSON[6].c[0]}</td>
            </tr>
          
          </tbody>
       </Table>

   */


  showConf() {

  }

	render(){
		return(

			<div className="row">
        Number of available conferences: {this.state.length}
        <br></br>
        <Button onClick={this.showConf}> Get IPFS Hash </Button>


        
      </div>
		);
	}
}


export default ConferenceList2