import React, { Component } from "react";
import ipfs from './utils/ipfs';
import Form from "react-jsonschema-form";
import web3 from './utils/web3'
import PaperContract from '../build/contracts/Paper.json'
import multihash from './utils/multihash';


import Button from 'react-bootstrap/lib/Button';


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
      },
      "Evaluation": {
        "type": "object",
        
        "properties": {
          "text":{
            "type": "string",
            "description": " Enter the text for the field Overall evaluation below. This field is required."
          },
          "score": {
            "type": "integer",
            "minimum": -3,
            "maximum": 3,
            "description": "3 strong accept, 2 accept, 1 weak accept, 0 borderline paper, -1 weak reject,-2 reject, -3 strong reject"
          }
        }
        
      },
      "Confidence": {
        "type": "integer",
        "description": " 5 (expert), 4 (high), 3 (medium), 2 (low), 1 (none)",
        "minimum": 1,
        "maximum": 5
      }, 
      "Remarks": {
        "type": "string", 
        "description": "Confidential remarks for the program committee" 
      },
      "Reviewer": {
        "type": "object",
        "properties": {
          "FirstName": {
            "type": "string"
          },
          "LastName": {
            "type": "string"
          },
          "E-Mail": {
            "type": "string"
          },

        }
      }
     
    },
    "required": ["PaperAddress", "Reviewer", "Evaluation", "Confidence"]
  };

  log = (type) => console.log.bind(console, type);

  onClick = async () => {
    try{
      this.setState({blockNumber:"waiting.."});
      this.setState({gasUsed:"waiting..."});

    //get Transaction Receipt in console on click
    //See: https://web3js.readthedocs.io/en/1.0/web3-eth.html#gettransactionreceipt

      await web3.eth.getTransactionReceipt(this.state.transactionHash, (err, txReceipt)=>{
        console.log(err,txReceipt);
        this.setState({txReceipt});
      }); //await for getTransactionReceipt

      await this.setState({blockNumber: this.state.txReceipt.blockNumber});
      await this.setState({gasUsed: this.state.txReceipt.gasUsed});    
      } //try
      catch(error){
          console.log(error);
        } //catch
    }; //onClick

  onSubmit = async ({formData}) => {
    // create buffer from javascript object
    // https://stackoverflow.com/questions/41951307/convert-a-json-object-to-buffer-and-buffer-to-json-object-back/
     const buffer = Buffer.from(JSON.stringify(formData));

     //bring in user's metamask account address
      const accounts = await web3.eth.getAccounts();

      const contract = require('truffle-contract')
      const paper = contract(PaperContract);
      paper.setProvider(web3.currentProvider);

      const paperInstance = await paper.at(formData.PaperAddress)

      await ipfs.add(buffer, (err, ipfsHash) => {
        
        //setState by setting ipfsHash to ipfsHash[0].hash 
        this.setState({ newIpfsHash:ipfsHash[0].hash });
        let { digest, hashFunction, size } = multihash.getBytes32FromMultiash(this.state.newIpfsHash);

        paperInstance.addReview(accounts[0], formData.Evaluation.score, digest, hashFunction, size , { from: accounts[0] , gasLimit: 6385876}).then(transactionHash => {
          console.log(transactionHash);
          let tx = transactionHash.tx;
          this.setState({transactionHash: tx});

          
          });

      }) //await ipfs.add 
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
        <Form schema={this.schema}
          onChange={this.log("changed")}
          onSubmit={this.onSubmit}
          onError={this.log("errors")} />

      </div>
    </div>
  </div>



        
        
    );
  }

}

export default CreateReview;