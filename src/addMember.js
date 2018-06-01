import React from 'react'
//import ConferenceRegistryContract from '../build/contracts/ConferenceRegistry.json'
import ConferenceContract from '../build/contracts/Conference.json'

import getWeb3 from './utils/getWeb3'

//import Web3 from 'web3'


import Button from 'react-bootstrap/lib/Button';


class AddMember extends React.Component{

	constructor(props){
		super(props);
		this.state={
      alert: 'none',

      role:"",
      newMember:"", 
      address: '', 
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

    })
    .catch(() => {
      console.log('Error finding web3.')
    })
}


  addMember = async () => {

    const contract = require('truffle-contract')
    let conference = contract(ConferenceContract);
    conference.setProvider(this.state.web3.currentProvider)

    // Get accounts.
    const accounts = await this.state.web3.eth.getAccounts() 

    // get conference instance
    const conferenceInstance = await conference.at(this.state.address)

    try{
      
      //let isAddress = this.state.web3.utils.isAddress(this.state.newMember)
      //let hasRole = await conferenceInstance.hasRole.call(accounts[0], 'admin',  {from: accounts[0]})
      //console.log("hasRole admin: " + hasRole)
      // For success notification
      var events = conferenceInstance.RoleAdded();
      events.watch((error, result) => { 
        if(!error){
          return this.setState({alert: 'inline-block'})
        }
        else{
          console.error(error)
        }
      });

      await conferenceInstance.adminAddRole(this.state.newMember,this.state.role, {from: accounts[0], gasLimit: 6385876})
      events.stopWatching();
    }
    catch(error){
      console.error(error)
    }
  }



	render(){
		return(

			<div className="row">
        <p>Add a "pcmember" or an "author" using her address to an existing conference.</p>
        <br></br>
        <input value={this.state.role} onChange={evt => this.setState({role: evt.target.value})} type="text" className="form-control" id="formGroupExampleInput" placeholder="New members role"></input>
        <input value={this.state.address} onChange={evt => this.setState({address: evt.target.value})} type="text" className="form-control" id="formGroupExampleInput" placeholder="Conference Contract Address"></input>


        <input value={this.state.newMember} onChange={evt => this.setState({newMember: evt.target.value})} type="text" className="form-control" id="formGroupExampleInput" placeholder="New Members Address"></input>
        <Button bsStyle="primary" type="submit" onClick={this.addMember}> Add Member </Button>

        <div className="alert alert-success alert-dismissible fade show" role="alert"  style={{display: this.state.alert}}>
          <button type="button" className="close" data-dismiss="alert" aria-label="Close">
            <span aria-hidden="true">&times;</span>
          </button>
          <strong>Success!</strong> 
        </div>
 
      </div>
		);
	}
}


export default AddMember