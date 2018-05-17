import React, { Component } from 'react';
//import logo from ‘./logo.svg’;
import './ipfsUpload.css';
import web3 from './web3'
import ipfs from './ipfs';
import storehash from './storehash';
import multihash from './utils/multihash';

import Button from 'react-bootstrap/lib/Button';

import Form from 'react-bootstrap/lib/Form';
import Table from 'react-bootstrap/lib/Table';


class CreateEventForm extends Component {
 
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

	captureFile =(event) => {
        event.stopPropagation()
        event.preventDefault()
        const file = event.target.files[0]
        let reader = new window.FileReader()
        reader.readAsArrayBuffer(file)
        reader.onloadend = () => this.convertToBuffer(reader)    
    };


 	convertToBuffer = async(reader) => {
      //file is converted to a buffer for upload to IPFS
        const buffer = await Buffer.from(reader.result);
      //set this buffer -using es6 syntax
        this.setState({buffer});
    };

  


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

  onSubmit = async (event) => {
   event.preventDefault();

     //bring in user's metamask account address
      const accounts = await web3.eth.getAccounts();
      console.log('Sending from Metamask account: ' + accounts[0]);
    
    //obtain contract address from storehash.js
      const ethAddress= await storehash.options.address;
      this.setState({ethAddress});

    //save document to IPFS,return its hash#, and set hash# to state
    //https://github.com/ipfs/interface-ipfs-core/blob/master/SPEC/FILES.md#add 

      await ipfs.add(this.state.buffer, (err, ipfsHash) => {
        console.log(err,ipfsHash);
        //setState by setting ipfsHash to ipfsHash[0].hash 
        this.setState({ newIpfsHash:ipfsHash[0].hash });
        let { digest, hashFunction, size } = multihash.getBytes32FromMultiash(this.state.newIpfsHash);
        
        storehash.methods.create(this.state.newTitle, this.state.newYear, digest, hashFunction, size ).send({
          from: accounts[0] 
        }, (error, transactionHash) => {
          console.log(transactionHash);
          this.setState({transactionHash});
        });
      }) //await ipfs.add 
    }; //onSubmit

  updateNewTitle(evt) {
    this.setState({newTitle: evt.target.value});
  };

  updateNewYear(evt) {
    this.setState({newYear: evt.target.value});
  }


	render() {
      
      return (
        <div className="createEventForm">


	
          <h3> Choose JSON-event file to send to IPFS </h3>
          <Form onSubmit={this.onSubmit}>
            <input 
              type="file"
              onChange={this.captureFile}
            />
            <p>Conference Details</p>
          <input value={this.state.newTitle} onChange={evt => this.updateNewTitle(evt)} type="text" className="form-control" id="formGroupExampleInput" placeholder="My Conference"></input>
          <input value={this.state.newYear} onChange={evt => this.updateNewYear(evt)} type="text" className="form-control" id="formGroupExampleInput" placeholder="Year"></input>
         
             <Button 
             bsStyle="primary" 
             type="submit"> 
             Send it 
             </Button>
          </Form>

	<hr/>
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
    } //render

} //App

export default CreateEventForm;