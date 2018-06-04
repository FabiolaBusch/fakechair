import React, { Component } from "react";
import ipfs from './utils/ipfs';
import Form from "react-jsonschema-form";
import web3 from './utils/web3'
import ConferenceRegistryContract from '../build/contracts/ConferenceRegistry.json'
import multihash from './utils/multihash';


import Button from 'react-bootstrap/lib/Button';

import Table from 'react-bootstrap/lib/Table';

class CreateConference extends Component {

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
    "title": "NewConference",
    "description": "Input form to create a new conference on the blockchain.",
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

 <div className="panel-group">
  <div className="panel panel-default">
    <div className="panel-heading">
      <h4 className="panel-title">
        <a data-toggle="collapse" href="#collapse1">Create a new Conference</a>
      </h4>
    </div>
    <div id="collapse1" className="panel-collapse collapse">
      <div className="panel-body">

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
      <div className="panel-footer">Panel Footer</div>
    </div>
  </div>
</div> 



        
   
    );
  }

}

export default CreateConference;