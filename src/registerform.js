import React, { Component } from 'react'
import UserContract from '../build/contracts/User.json'
import getWeb3 from './utils/getWeb3'



class Form extends Component{

  static username =  '';
  static showForm = true;


  constructor(props) {
    super(props)

    this.state = {
      registered: false,
      web3: null,
      username: ''
    };

    this.updateUserName = this.updateUserName.bind(this);
    this.registerUser = this.registerUser.bind(this);
  }


  updateUserName(evt) {
    this.setState({username: evt.target.value});
  }

  componentWillMount() {
    // Get network provider and web3 instance.
    // See utils/getWeb3 for more info.

    getWeb3.then(results => {
      this.setState({
        web3: results.web3
      })

    })
    .catch(() => {
      console.log('Error finding web3.')
    })
  }


  registerUser() {
    const contract = require('truffle-contract')
    const user = contract(UserContract)
    user.setProvider(this.state.web3.currentProvider)

    // Get accounts.
    this.state.web3.eth.getAccounts((error, accounts) => {
      user.deployed().then((instance) => {
        this.userInstance = instance

        this.setState({registered: true})

        return this.userInstance.registerUser(this.username,{from: accounts[0]});
        }).catch(function(err) {
      console.log(err.message);
    });
    })
  }

  isRegistered(){
    const contract = require('truffle-contract')
    const user = contract(UserContract)
    user.setProvider(this.state.web3.currentProvider)

    // Get accounts.
    this.state.web3.eth.getAccounts((error, accounts) => {
      user.deployed().then((instance) => {
        this.userInstance = instance
        
        return this.userInstance.isRegistered.call(accounts[0])
        }).catch(function(err) {
      console.log(err.message);
    });
    })

  }

  getName(){
    const contract = require('truffle-contract')
    const user = contract(UserContract)
    user.setProvider(this.state.web3.currentProvider)

    // Get accounts.
    return this.state.web3.eth.getAccounts((error, accounts) => {
      user.deployed().then((instance) => {
        this.userInstance = instance
        
        return this.userInstance.getName.call()
        }).catch(function(err) {
      console.log(err.message);
    });
    })
  }


  render() {
    return (

      <form>
        <div className="form-group registerForm">
          <input value={this.state.username} onChange={this.updateUserName} type="text" className="form-control" id="formGroupExampleInput" placeholder="Jane Doe"></input>
          <br></br>
          <button onClick={this.registerUser} className="btn btn-primary mb-2 btn-lg btn-block">Register</button>
        </div>
      </form>

    );
  }

}

// doesnt work since dangerous HTML
class Greeting extends Form{
   render(){
    return(
      <div className="alert alert-success registerForm" role="alert">
        Welcome { this.getName } !
      </div>
    );
  }
}

class RegisterForm extends Form{

  render(){
    return(
      <div>

        { this.state.registered ? <Greeting /> :   <Form />}

      </div>
    );
  }

}

export default RegisterForm