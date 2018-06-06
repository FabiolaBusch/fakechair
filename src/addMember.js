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
      role:"author",
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
        web3: results.web3,
        transactionHash: ''
      })

    })
    .catch(() => {
      console.log('Error finding web3.')
    })
}


  addMember = async () => {
    try{
      this.setState({transactionHash: '...waiting'})
      const contract = require('truffle-contract')
      let conference = contract(ConferenceContract);
      conference.setProvider(this.state.web3.currentProvider)

      // Get accounts.
      const accounts = await this.state.web3.eth.getAccounts() 

      // get conference instance
      const conferenceInstance = await conference.at(this.state.address)

      //let isAddress = this.state.web3.utils.isAddress(this.state.newMember)
      //let hasRole = await conferenceInstance.hasRole.call(accounts[0], 'admin',  {from: accounts[0]})
      //console.log("hasRole admin: " + hasRole)      
      console.log(this.state.role)

      const transactionHash = await conferenceInstance.adminAddRole(this.state.newMember,this.state.role, {from: accounts[0], gasLimit: 6385876})
      this.setState({transactionHash: transactionHash.tx})
    }
    catch(error){
      this.setState({transactionHash: 'Transaction failed. Only Admin can add members.'})
      console.error(error)
    }
  }

  setRole = (event) => {
    this.setState({role: event.target.value});
    console.log(this.state.role)
    console.log('role was set')
  }



	render(){
		return(

			<div className="container">
        <p>Add a PC member or an author using her address to an existing conference.</p>
        <br></br>
        
        
          <div className="form-group">
            <label >Select a role:</label>
            <select value={this.state.role} onChange={evt => this.setState({role: evt.target.value})} className="form-control">
              <option value="author">Author</option>
              <option value="pcmember">PC Member</option>
            </select>
          </div> 
          <input value={this.state.address} onChange={evt => this.setState({address: evt.target.value})} type="text" className="form-control" id="formGroupExampleInput" placeholder="Conference Contract Address"></input>
          <input value={this.state.newMember} onChange={evt => this.setState({newMember: evt.target.value})} type="text" className="form-control" id="formGroupExampleInput" placeholder="New Members Address"></input>
          <Button bsStyle="primary" type="submit" onClick={this.addMember}> Add Member </Button>
          

        <p>TX Hash: {this.state.transactionHash}</p>
 
      </div>
		);
	}
}


export default AddMember

//<input value={this.state.role} onChange={evt => this.setState({role: evt.target.value})} type="text" className="form-control" id="formGroupExampleInput" placeholder="New members role"></input>
