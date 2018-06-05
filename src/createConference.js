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
        "type": "string",
        "default" : "Conference on future Examples"
      }, 
      "Year": {
        "description": "Year the Conference will take place",
        "type": "integer", 
        "minimum": 2018, 
        "default" : 2018
      },
      "Start": {
        "format": "alt-date",
        "type": "string",
        "description": "Event starting time",
        "default" : "2018-12-01T12:00"
      },
      "End": {
        "format": "alt-date",
        "type": "string",
        "description": "Event ending time",
        "default": "2018-12-03T12:00"
      },
      "Abstract": {
        "type": "string",
        "description": "A brief description of the event.",
        "minLength": 500,
        "maxLength": 1500,
        "default": "Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et e"
      }, 
      "Topics": {
        "type": "array", 
        "items": {
          "type": "string", 
          "description": "Topics of interest."
        }, 
        "minLength": 1,
        "uniqueItems": true,
        "default": ["Blockchain","Cryptography" ]
      }, 
      "Paper-Submission-Date": {
        "format": "alt-date",
        "type": "string",
        "default" : "2018-12-01T12:00"
      }, 
      "Acceptance-Notification-Date": {
        "format": "alt-date",
        "type": "string",
        "default" : "2018-12-01T12:00"
      }, 
      "Submission-Details": {
        "type": "string", 
        "description": "Details about the submission format, length, requirements and conditions.",
        "default" : "Document in IEEE Transactions format."
      }, 
      "Chairs": {
        "type": "array", 
        "items": {
          "type": "string", 
          "description": "Name/id of chairs"
        }, 
        "minItems": 1,
        "uniqueItems": true,
        "default" : ["George Exampleman"]

      },
      "Programm-Committee": {
        "type": "array", 
        "items": {
          "type": "string",
          "description": "Name/id of PC members."
        }, 
        "minItems": 1,
        "uniqueItems": true,
        "default" : ["Helga Examplewoman","Susan Examplemember"]
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

  onSubmit = async ({formData}) => {
    try{
      // create buffer from javascript object
      // https://stackoverflow.com/questions/41951307/convert-a-json-object-to-buffer-and-buffer-to-json-object-back/
      const buffer = Buffer.from(JSON.stringify(formData));

     //bring in user's metamask account address
      const accounts = await web3.eth.getAccounts();
      console.log('Sending from Metamask account: ' + accounts[0]);

      const contract = require('truffle-contract')
      const conferenceRegistry = contract(ConferenceRegistryContract);
      conferenceRegistry.setProvider(web3.currentProvider);

      //https://github.com/ipfs/interface-ipfs-core/blob/master/SPEC/FILES.md#add 
      const ipfsHash = await ipfs.add(buffer)
        
      //setState by setting ipfsHash to ipfsHash[0].hash 
      this.setState({ newIpfsHash:ipfsHash[0].hash });
      let { digest, hashFunction, size } = multihash.getBytes32FromMultiash(this.state.newIpfsHash);
      
    
      const conferenceRegistryInstance = await conferenceRegistry.deployed()
      // first parameter is admin address, could be done more elegant?
      const transactionHash = await conferenceRegistryInstance.create(accounts[0], formData.Title, formData.Year, digest, hashFunction, size , { from: accounts[0] , gasLimit: 6385876})

      this.setState({transactionHash: transactionHash.tx});
    }catch (error) {
      console.error(error);
    }
  };



render() {

  return (
  <div className="card">
    <div className="card-header" id="headingOne">
      <h1 className="mb-0">
        <button className="btn btn-link" type="button" data-toggle="collapse" data-target="#collapseOne" aria-expanded="false" aria-controls="collapseOne">
          Create a new Conference
        </button>
      </h1>
    </div>

    <div id="collapseOne" className="collapse" aria-labelledby="headingOne" data-parent="#accordionExample">
      <div className="card-body">
        <Form schema={this.schema} onSubmit={this.onSubmit} onError={this.log("errors")} />
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
    </div>
  </div>




        
   
    );
  }

}

export default CreateConference;

/*


<div className="container">
 <div className="panel-group">
  <div className="panel panel-default">
    <div className="panel-heading">
      <h4 className="panel-title">
        <a data-toggle="collapse" href="#collapse1">Create a new Conference</a>
      </h4>
    </div>
    <div id="collapse1" className="panel-collapse collapse">
      <div className="panel-body">
        <Form schema={this.schema} onChange={this.log("changed")} onSubmit={this.onSubmit} onError={this.log("errors")} />
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
    </div>
  </div>
</div> 
</div>


 */