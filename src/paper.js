import React from 'react'
import Button from 'react-bootstrap/lib/Button';
import getWeb3 from './utils/getWeb3'
import multihash from './utils/multihash';
import Review from './review';

import PaperContract from '../build/contracts/Paper.json'

class Paper extends React.Component{

  constructor(props){
    super(props);
    this.state={
      web3: null,
      reviewHashes: [],
      reviewsLength:'',
      reviewAddresses: [],
      scores: ['no score']

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
  showReviews = async () =>  {

    const contract = require('truffle-contract')
    let paper = contract(PaperContract);
    paper.setProvider(this.state.web3.currentProvider)

    // Get accounts.
    const accounts = await this.state.web3.eth.getAccounts() 

    // get conference instance
    const paperInstance = await paper.at(this.props.address)

    const reviewsLength = await paperInstance.getReviewsLength({from: accounts[0]})

    this.setState({reviewsLength: reviewsLength.c[0]})

    const hashes = [];
    const reviewAddresses = [];
    const scores = [];

    for (let i = 0; i < this.state.reviewsLength; i += 1) {

      let review = await paperInstance.getReviewByIndex(i,{from: accounts[0]})

      reviewAddresses[i] = review[0];
      scores[i] = review[2].s*review[2].c[0];
      hashes[i] = multihash.getMultihashFromContractResponse([review[3].toString(), review[4].c[0].toString(), review[5].c[0].toString()])
    };


    this.setState({reviewHashes: hashes, reviewAddresses: reviewAddresses, scores: scores})
  }


	render(){
    const children = [];

    for (var i = 0; i < this.state.reviewsLength; i += 1) {

      children.push( <Review key={i} number={i} address={this.state.reviewAddresses[i]} hash={this.state.reviewHashes[i]} score={this.state.scores[i]} />);
    };

		return(

      <div className="col-sm-6">
        <div className="card">
          <div className="card-header">
            {this.props.title}
          </div>
          <div className="card-body">
            <a target="_blank" href={ 'https://ipfs.io/ipfs/' + this.props.hash } className="card-link">Read Paper</a>
            <p className="card-text">As part of: {this.props.confTitle}</p>
            <p className="card-text">Address: {this.props.address}</p>

            <Button bsStyle="primary"  onClick={this.showReviews}> See Reviews </Button>

            <ul>
            {children}
            </ul>
          </div>
        </div>
      </div>


        
		);
	}
}

export default Paper