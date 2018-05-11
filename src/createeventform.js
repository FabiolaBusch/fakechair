import React from 'react'
import ConferenceRegistryContract from './build/contracts/ConferenceRegistry.json'
import getWeb3 from './utils/getWeb3'




class CreateEventForm extends React.Component{


  constructor(props) {
    super(props)

    this.state = {
      newId: 0,
      newTitle: ''
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

  create(_id, _title) {
    const contract = require('truffle-contract')
    const conferenceReg = contract(ConferenceRegistryContract)
    conferenceReg.setProvider(this.state.web3.currentProvider)

    // Get accounts.
    this.state.web3.eth.getAccounts((error, accounts) => {
      conferenceReg.deployed().then((instance) => {
        this.conferenceRegInst = instance

        return this.conferenceRegInst.create(_id, _title, {from: accounts[0]});
        }).catch(function(err) {
      console.log(err.message);
    });
    })
  }

   updateNewListing(evt) {
    this.setState({newTitle: evt.target.value});
  }



	render(){
		return(
			<form className="createEventForm">
			  <div className="form-group">
			    <p>Conference Name</p>
			    <input value={this.state.newTitle} onChange={evt => this.updateNewListing(evt)} type="text" className="form-control" id="formGroupExampleInput" placeholder="My Conference"></input>
			  </div>
				<button type="submit" onClick={() => this.create(this.state.newId, this.state.newTitle)} className="btn btn-primary">Create</button>
			 
      </form>
		);
	}
}


export default CreateEventForm