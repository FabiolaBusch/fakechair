import React from 'react'
import ConferenceRegistryContract from '../build/contracts/ConferenceRegistry.json'
import ConferenceContract from '../build/contracts/Conference.json'

import getWeb3 from './utils/getWeb3'

import multihash from './utils/multihash';
import Conference from './conference'
import cleanTitle from './utils/cleanTitle'

import Button from 'react-bootstrap/lib/Button';

class ConferenceList extends React.Component{

	constructor(props){
		super(props);
		this.state={
      web3: '',
			conferencesLength: 0,
      accountRole: [],

      addresses:[],
      years:[],
      cleanTitles:[],
      hashes: []
		};
	}

  componentWillMount() {

    getWeb3.then(results => {
      this.setState({web3: results.web3})

      this.showConferences();
    })
    .catch(() => {
      console.log('Error finding web3.')
    })

    
}


  showConferences = async () =>  {
    try{

      this.setState({cleanTitles: ['... waiting','... waiting']})

      const contract = require('truffle-contract')
      const conferenceRegistry = contract(ConferenceRegistryContract)
      conferenceRegistry.setProvider(this.state.web3.currentProvider)
      const conference = contract(ConferenceContract);
      conference.setProvider(this.state.web3.currentProvider)

      // Get accounts.
      const accounts = await this.state.web3.eth.getAccounts() 


      const conferenceRegistryInstance = await conferenceRegistry.deployed() 
      const conferencesLength = await conferenceRegistryInstance.conferencesLength.call({from: accounts[0]})
      this.setState({ conferencesLength: conferencesLength.c[0] })

      //const result = await conferenceRegistryInstance.getConference(this.state.searchTitle, this.state.searchYear, {from: accounts[0]})
      const addresses = [];
      const years = [];
      const cleanTitles = [];
      const hashes = [];
      const accountRole = [];

      for (let i = 0; i < this.state.conferencesLength; i += 1) {

        let conferenceData = await conferenceRegistryInstance.getConferenceByIndex(i,{from: accounts[0]})
        //let author = paper[1];

        addresses[i] = conferenceData[0];
        years[i] = conferenceData[3].c[0];
        cleanTitles[i] = cleanTitle(conferenceData[2]); 
        hashes[i] = multihash.getMultihashFromContractResponse([conferenceData[4].toString(), conferenceData[5].c[0], conferenceData[6].c[0].toString()])
      
        let conferenceInstance = await conference.at(addresses[i]);
        accountRole[i] = await conferenceInstance.getRole(accounts[0]);
        this.props.getRolesForConferences(addresses[i],accountRole[i])
      };



      this.setState({addresses,years,cleanTitles,hashes,accountRole})
    } catch(error){
      console.error(error);
    }
  }



  /*
  Creates arbitrary number of conference Listings, depending on button-clicks.
   */
	render(){
    const children = [];

    for (var i = 0; i < this.state.conferencesLength; i += 1) {

      children.push( <Conference key={i} title={this.state.cleanTitles[i]} year={this.state.years[i]} hash={this.state.hashes[i]} address={this.state.addresses[i]} role={this.state.accountRole[i]}/>);
    };


		return(

			<div className="container">
        <p>Number of available conferences: {this.state.conferencesLength}. <Button bsStyle="default" onClick={this.showConferences}>Update</Button></p>

        {children}        
      </div>
		);
	}
}




export default ConferenceList