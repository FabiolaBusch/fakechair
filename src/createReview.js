import React, { Component } from "react";
import ipfs from './utils/ipfs';
import Form from "react-jsonschema-form";
import web3 from './utils/web3'
import ConferenceRegistryContract from '../build/contracts/ConferenceRegistry.json'
import multihash from './utils/multihash';


import Button from 'react-bootstrap/lib/Button';

import Table from 'react-bootstrap/lib/Table';

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
      "Paper Address": {
        "type": "string"
      }, 
      "Paper Author": {
        "type": "string", 
      },
      "PC Member": {
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
          "First Name": {
            "type": "string"
          },
          "Last Name": {
            "type": "string"
          },
          "E-Mail": {
            "type": "string"
          },

        }
      }
     
    },
    "required": ["Paper Address", "Paper Author","Reviewer", "Evaluation", "Confidence"]
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

  onSubmitETHIPFS = async ({formData}) => {
    // create buffer from javascript object
    // https://stackoverflow.com/questions/41951307/convert-a-json-object-to-buffer-and-buffer-to-json-object-back/
     const buffer = Buffer.from(JSON.stringify(formData));

     //bring in user's metamask account address
      const accounts = await web3.eth.getAccounts();
      console.log('Sending from Metamask account: ' + accounts[0]);

      const contract = require('truffle-contract')
      const conferenceRegistry = contract(ConferenceRegistryContract);
      conferenceRegistry.setProvider(web3.currentProvider);
    
    //save document to IPFS,return its hash#, and set hash# to state
    //https://github.com/ipfs/interface-ipfs-core/blob/master/SPEC/FILES.md#add 

      await ipfs.add(buffer, (err, ipfsHash) => {
        
        //setState by setting ipfsHash to ipfsHash[0].hash 
        this.setState({ newIpfsHash:ipfsHash[0].hash });
        let { digest, hashFunction, size } = multihash.getBytes32FromMultiash(this.state.newIpfsHash);
        
        // gas limit: highes possible amount
        // storehash.methods.create(formD ...).send() ...
        // 
        conferenceRegistry.deployed().then(instance => {

          // first parameter is admin address, could be done more elegant?
          instance.create(accounts[0], formData.Title, formData.Year, digest, hashFunction, size , { from: accounts[0] , gasLimit: 6385876}).then(transactionHash => {
          console.log(transactionHash);
          let tx = transactionHash.tx;
          this.setState({transactionHash: tx});

          
          });
        })
      }) //await ipfs.add 
    }; //onSubmit



render() {

  return (
    <div>
    <Form schema={this.schema}
          onChange={this.log("changed")}
          onSubmit={this.onSubmitETHIPFS}
          onError={this.log("errors")} />

     <Button onClick={this.onClick}> Get Transaction Receipt </Button>

  <Table bordered responsive>
                <thead>
                  <tr>
                    <th>Tx Receipt Category</th>
                    <th>Values</th>
                  </tr>
                </thead>
               
                <tbody>
                  <tr>
                    <td>IPFS Hash # stored on Eth Contract</td>
                    <td>{this.state.newIpfsHash}</td>
                  </tr>


                  <tr>
                    <td>Tx Hash # </td>
                    <td>{this.state.transactionHash}</td>
                  </tr>

                  <tr>
                    <td>Block Number # </td>
                    <td>{this.state.blockNumber}</td>
                  </tr>

                  <tr>
                    <td>Gas Used</td>
                    <td>{this.state.gasUsed}</td>
                  </tr>
                
                </tbody>
            </Table>
        
     </div>     
    );
  }

}

export default CreateReview;