import React, { Component } from "react";
import ipfs from './ipfs';
import Form from "react-jsonschema-form";
import web3 from './web3'

import storehash from './storehash';
import multihash from './utils/multihash';


import Button from 'react-bootstrap/lib/Button';

import Table from 'react-bootstrap/lib/Table';

class EventSchemaInput extends Component {

    state = {
      newIpfsHash:null,
      buffer:'',
      ethAddress:'',
      blockNumber:'',
      transactionHash:'',
      gasUsed:'',
      newYear: '',  
      newTitle: '',   
      txReceipt: '' 
    };

  schema = {
    "$schema": "http://json-schema.org/draft-06/schema#",
    "title": "NewEvent",
    "description": "Description of a new Conference",
    "type": "object",
    "properties": {
      "Title": {
        "type": "string"
      }, 
      "Year": {
        "description": "Year the Conference will take place",
        "type": "integer", 
        "minimum": 2018
      },
      "Start": {
        "format": "alt-date",
        "type": "string",
        "description": "Event starting time"
      },
      "End": {
        "format": "alt-date",
        "type": "string",
        "description": "Event ending time"
      },
      "Abstract": {
        "type": "string",
        "description": "A brief description of the event.",
        "minLength": 500,
        "maxLength": 1500
      }, 
      "Topics": {
        "type": "array", 
        "items": {
          "type": "string", 
          "description": "Topics of interest."
        }, 
        "minLength": 1,
              "uniqueItems": true
      }, 
      "Paper-Submission-Date": {
        "format": "alt-date",
        "type": "string"
      }, 
      "Acceptance-Notification-Date": {
        "format": "alt-date",
        "type": "string"
      }, 
      "Submission-Details": {
        "type": "string", 
        "description": "Details about the submission format, length, requirements and conditions."
      }, 
      "Chairs": {
        "type": "array", 
        "items": {
          "type": "string", 
          "description": "Name/id of chairs"
        }, 
        "minItems": 1,
              "uniqueItems": true

      },
      "Programm-Committee": {
        "type": "array", 
        "items": {
          "type": "string",
          "description": "Name/id of PC members."
        }, 
        "minItems": 1,
              "uniqueItems": true
      }
    },
    "required": ["title", "year","start", "end", "abstract", "topics", "paper-submission-date", "acceptance-notification-date", "submission-details" ]
  };

  log = (type) => console.log.bind(console, type);

  onSubmit = ({formData}) => console.log("Data submitted: ",  formData);

  onSubmitIPFS = async ({formData}) => {
    const buf = Buffer.from(JSON.stringify(formData)); // create Buffer 
    
    await ipfs.add(buf, (err, ipfsHash) => {
        console.log(err,ipfsHash);
        }
      ); 
  };

  onSubmitETHIPFS = async ({formData}) => {
    // create buffer from javascript object
    // https://stackoverflow.com/questions/41951307/convert-a-json-object-to-buffer-and-buffer-to-json-object-back/
     const buffer = Buffer.from(JSON.stringify(formData));

     //bring in user's metamask account address
      const accounts = await web3.eth.getAccounts();
      console.log('Sending from Metamask account: ' + accounts[0]);
    
    //obtain contract address from storehash.js
      const ethAddress= await storehash.options.address;
      this.setState({ethAddress});

    //save document to IPFS,return its hash#, and set hash# to state
    //https://github.com/ipfs/interface-ipfs-core/blob/master/SPEC/FILES.md#add 

      await ipfs.add(buffer, (err, ipfsHash) => {
        console.log(err,ipfsHash);
        //setState by setting ipfsHash to ipfsHash[0].hash 
        this.setState({ newIpfsHash:ipfsHash[0].hash });
        let { digest, hashFunction, size } = multihash.getBytes32FromMultiash(this.state.newIpfsHash);
        
        // gas limit: highes possible amount
        storehash.methods.create(formData.Title, formData.Year, digest, hashFunction, size ).send({
          from: accounts[0] , gasLimit: 6385876
        }, (error, transactionHash) => {
          console.log(transactionHash);
          //this.setState({transactionHash});
        });
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
                    <td>Ethereum Contract Address</td>
                    <td>{this.state.ethAddress}</td>
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

export default EventSchemaInput;