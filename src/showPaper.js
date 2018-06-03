import React from 'react'
import ConferenceContract from '../build/contracts/Conference.json'
import getWeb3 from './utils/getWeb3'
import multihash from './utils/multihash';

import Web3 from 'web3'

import Button from 'react-bootstrap/lib/Button';



class ShowPaper extends React.Component{

	constructor(props){
		super(props);
		this.state={
      web3: null,
      conferenceAddress:'',
      paperHash: '',
      title:''

		};
	}

  componentWillMount() {
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

  /*
  Show the requested conference's details on button click.
   */
  showPaper = async () =>  {

    const contract = require('truffle-contract')
    let conference = contract(ConferenceContract);
    conference.setProvider(this.state.web3.currentProvider)

    // Get accounts.
    const accounts = await this.state.web3.eth.getAccounts() 

    // get conference instance
    const conferenceInstance = await conference.at(this.state.conferenceAddress)


    const paper = await conferenceInstance.getPaperByIndex(2,{from: accounts[0]})
     
    let author = paper[1];
    let cleanTitle = Web3.utils.toAscii('0' + paper[2].split('0')[1]); 
    let hash = multihash.getMultihashFromContractResponse([paper[3].toString(), paper[4].c[0].toString(), paper[5].c[0].toString()])
    this.setState({paperHash: hash, title: cleanTitle})
  }


	render(){
		return(

			<div>
        <input value={this.state.conferenceAddress} onChange={evt => this.setState({conferenceAddress: evt.target.value})} type="text" className="form-control" id="formGroupExampleInput" placeholder="Conference Address"></input>
        <Button bsStyle="primary"  onClick={this.showPaper}> Show </Button>

        <ul className="list-group">
          <li>Paper: <a  target="_blank" href={ 'http://localhost:8080/ipfs/' + this.state.paperHash }>{this.state.title}</a></li>

        </ul>
      </div>
		);
	}
}




export default ShowPaper