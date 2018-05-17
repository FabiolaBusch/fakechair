import React from 'react'
import Conference from './conference'
import ConferenceRegistryContract from './build/contracts/ConferenceRegistry.json'
import getWeb3 from './utils/getWeb3'



class ConferenceList extends React.Component{

	constructor(props){
		super(props);
		this.state={
			confs: Array(4).fill('Access'),
			data: [
				{id: 1, title:'ExampleConf1', creator:'ExapleChair1',shortDescr:'This is a short description for an event, a journal or a conference that helps to distinguish the events.'},
				{id: 2, title:'ExampleConf2', creator:'ExapleChair2',shortDescr:'This is a short description for an event, a journal or a conference that helps to distinguish the events.'},
				{id: 3, title:'ExampleConf3', creator:'ExapleChair3',shortDescr:'This is a short description for an event, a journal or a conference that helps to distinguish the events.'},
				{id: 4, title:'ExampleConf4', creator:'ExapleChair4',shortDescr:'This is a short description for an event, a journal or a conference that helps to distinguish the events.'}				
			],
			allConfs: 'null'
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

  getLength() {
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
  }

  getAllConferences() {
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
  }


	renderConf(i){
		return (<Conference 
			data={this.state.data[i]}
			value={this.state.confs[i]} 
			onClick={() => this.handleSelect(i)}

		/>
		);
	}

	handleSelect(i){
		const confs = this.state.confs.slice();
		confs[i] = 'Accessed';
		this.setState({confs: confs});
	}

	render(){
		return(

			<div className="row">
        <div className="col-xs-12 col-sm-8 col-sm-push-2">
            <div id="confRow" className="row">
             {this.renderConf(0)}
						 {this.renderConf(1)}
						 {this.renderConf(2)}
						 {this.renderConf(3)}
            </div>
          <br/>
        </div>
      </div>
		);
	}
}


export default ConferenceList