import React from 'react'
import ConferenceRegistryContract from '../build/contracts/ConferenceRegistry.json'
import getWeb3 from './utils/getWeb3'

import multihash from './utils/multihash';
import Conference from './conference'
import cleanTitle from './utils/cleanTitle'



class ConferenceList extends React.Component{

	constructor(props){
		super(props);
		this.state={
      web3: '',
			conferencesLength: 0,

      addresses:[],
      years:[],
      cleanTitles:[],
      hashes: []
		};
	}

  componentWillMount() {

    getWeb3.then(results => {
      this.setState({web3: results.web3})

      this.showConf();
    })
    .catch(() => {
      console.log('Error finding web3.')
    })

    
}


  /*
  Show the requested conference's details on button click.
   */
  showConf = async () =>  {


    const contract = require('truffle-contract')
    const conferenceRegistry = contract(ConferenceRegistryContract)
    conferenceRegistry.setProvider(this.state.web3.currentProvider)

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

    for (let i = 0; i < this.state.conferencesLength; i += 1) {

      let conference = await conferenceRegistryInstance.getConferenceByIndex(i,{from: accounts[0]})
      //let author = paper[1];

      addresses[i] = conference[0];
      years[i] = conference[3].c[0];
      cleanTitles[i] = cleanTitle(conference[2]); 
      hashes[i] = multihash.getMultihashFromContractResponse([conference[4].toString(), conference[5].c[0], conference[6].c[0].toString()])
    };

    this.setState({addresses,years,cleanTitles,hashes})
  }

 

  /*
  Creates arbitrary number of conference Listings, depending on button-clicks.
   */
	render(){
    const children = [];

    for (var i = 0; i < this.state.conferencesLength; i += 1) {

      children.push( <Conference key={i} title={this.state.cleanTitles[i]} year={this.state.years[i]} hash={this.state.hashes[i]} address={this.state.addresses[i]} />);
    };


		return(

			<div className="container">
        <p>Number of available conferences: {this.state.conferencesLength}. </p>

        {children}        
      </div>
		);
	}
}




export default ConferenceList