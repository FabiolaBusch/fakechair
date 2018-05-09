import React, { Component } from 'react'
import UserContract from '../build/contracts/User.json'
import getWeb3 from './utils/getWeb3'

class RegisterForm extends Component{
  constructor(props) {
    super(props)

    this.state = {
      registered: false,
      web3: null
    }
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
    const user = contract(UserContract)
    
    user.setProvider(this.state.web3.currentProvider)

    // Declaring this for later so we can chain functions on SimpleStorage.
    var userInstance

    // Get accounts.
    this.state.web3.eth.getAccounts((error, accounts) => {
      user.deployed().then((instance) => {
        userInstance = instance

        return userInstance.registerUser('USERNAME',{from: accounts[0]})
      }).then((result) => {

        return userInstance.isRegistered.call(accounts[0])
      }).then((result) => {
        // Update state with the result.
        
        return this.setState({ registered: result.c[0] })
      }).catch(function(err) {
      console.log(err.message);
    });
    })
  }

  render() {
    return (
      <form>
        <div className="form-group">
          <label for="formGroupExampleInput">Register</label>
          <input type="text" className="form-control" id="formGroupExampleInput" placeholder="Jane Doe">
          <button onClick={() => this.instantiateContract()} className="btn btn-primary mb-2">Register {this.state.registered}</button>
        </div>
      </form>
    );
  }

}

export default RegisterForm