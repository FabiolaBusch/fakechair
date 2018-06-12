import React, { Component } from "react";
import ipfs from './utils/ipfs';
import Form from "react-jsonschema-form";
import web3 from './utils/web3'
import PaperContract from '../build/contracts/Paper.json'
import multihash from './utils/multihash';


class CreateReview extends Component {

    state = {
      newIpfsHash:null,
      buffer:'',
      blockNumber:'',
      transactionHash:'',
      gasUsed:'',
      newYear: '',  
      newTitle: '',   
      txReceipt: '' 
    };

  schema = {
    "$schema": "http://json-schema.org/draft-06/schema#",
    "title": "Review",
    "description": "Review form.",
    "type": "object",
    "properties": {
      "PaperAddress": {
        "type": "string"
      }, 
      "PCMember": {
        "type": "string",
        "default": "Helga Examplewoman"
      },
      "Evaluation": {
        "type": "object",
        
        "properties": {
          "text":{
            "type": "string",
            "description": " Enter the text for the field Overall evaluation below. This field is required.",
            "default": "Very good!"
          },
          "score": {
            "type": "integer",
            "minimum": -3,
            "maximum": 3,
            "description": "3 strong accept, 2 accept, 1 weak accept, 0 borderline paper, -1 weak reject,-2 reject, -3 strong reject",
            "default": 3
          }
        }
        
      },
      "Confidence": {
        "type": "integer",
        "description": " 5 (expert), 4 (high), 3 (medium), 2 (low), 1 (none)",
        "minimum": 1,
        "maximum": 5,
        "default": 5
      }, 
      "Remarks": {
        "type": "string", 
        "description": "Confidential remarks for the program committee",
        "default": "Nothing to say."
      },
      "Reviewer": {
        "type": "object",
        "properties": {
          "FirstName": {
            "type": "string",
            "default": "Luke"
          },
          "LastName": {
            "type": "string",
            "default": "Delegateman"
          },
          "E-Mail": {
            "type": "string",
            "default": "luke.delegateman@cool-university.com"
          },

        }
      }
     
    },
    "required": ["PaperAddress", "Reviewer", "Evaluation", "Confidence"]
  };

  log = (type) => console.log.bind(console, type);


  onSubmit = async ({formData}) => {
    try{
      this.setState({ transactionHash: '... waiting' });
    // create buffer from javascript object
    // https://stackoverflow.com/questions/41951307/convert-a-json-object-to-buffer-and-buffer-to-json-object-back/
     const buffer = Buffer.from(JSON.stringify(formData));

     //bring in user's metamask account address
      const accounts = await web3.eth.getAccounts();

      const contract = require('truffle-contract')
      const paper = contract(PaperContract);
      paper.setProvider(web3.currentProvider);


      let conference = this.props.confPaperMapping[formData.PaperAddress]
      let role = this.props.roleConfMapping[conference]
      console.log(role)
      if(role==='author' || role==='none'){
        throw new Error(" Only PC members or Admins can add reviews to a conference. ");
      }

      const paperInstance = await paper.at(formData.PaperAddress)

      const ipfsHash = await ipfs.add(buffer)
        
      //setState by setting ipfsHash to ipfsHash[0].hash 
      this.setState({ newIpfsHash:ipfsHash[0].hash });
      let { digest, hashFunction, size } = multihash.getBytes32FromMultiash(this.state.newIpfsHash);
      console.log(formData.Evaluation.score)

      const transactionHash = await paperInstance.addReview(accounts[0], formData.Evaluation.score, digest, hashFunction, size , { from: accounts[0] , gasLimit: 6385876})

      let tx = transactionHash.tx;
      this.setState({transactionHash: tx});
    }catch (error) {
      this.setState({transactionHash: 'Transaction failed.'})
      console.error(error);
    }

    }; //onSubmit



render() {

  return (
    
      <div className="card">
        <div className="card-header" id="headingTwo">
          <h1 className="mb-0">
            <button className="btn btn-link collapsed" type="button" data-toggle="collapse" data-target="#collapseTwo" aria-expanded="false" aria-controls="collapseTwo">
              Create Review
            </button>
          </h1>
        </div>
        <div id="collapseTwo" className="collapse" aria-labelledby="headingTwo" data-parent="#accordionExample">
          <div className="card-body">
            <Form schema={this.schema} onSubmit={this.onSubmit} onError={this.log("errors")} />

            <p>IPFS Hash: {this.state.newIpfsHash} </p>
            <p>TX Hash: {this.state.transactionHash} </p>
          </div>
        </div>
      </div>   
    );
  }

}

export default CreateReview;