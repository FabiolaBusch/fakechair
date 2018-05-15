import React from 'react'
import ConferenceRegistryContract from '../build/contracts/ConferenceRegistry.json'
//import getWeb3 from './utils/getWeb3'
import web3 from './web3'
import ipfs from './ipfs';


class CreateEventForm extends React.Component{


  constructor(props) {
    super(props)

    this.state = {
      newId: 0,
      newTitle: '',
      newYear: '',
      ipfsHash:null,
      buffer:'',
      blockNumber:'',
      transactionHash:'',
      gasUsed:'',
      txReceipt: ''   

    };
  }

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



  //create(_title, _year) {
  //
  onSubmit = async (event) => {
    event.preventDefault();
    const contract = require('truffle-contract')
    const conferenceReg = contract(ConferenceRegistryContract)
    conferenceReg.setProvider(web3.currentProvider)
    
    
     //bring in user's metamask account address
    const accounts = await web3.eth.getAccounts();
    console.log('Sending from Metamask account: ' + accounts[0]);

    //save document to IPFS,return its hash#, and set hash# to state
    //https://github.com/ipfs/interface-ipfs-core/blob/master/SPEC/FILES.md#add 

    await ipfs.add(this.state.buffer, (err, ipfsHash) => {
      
      //setState by setting ipfsHash to ipfsHash[0].hash 
      this.setState({ ipfsHash:ipfsHash[0].hash });
      console.log("Ipfs Hash:" + this.state.ipfsHash);
      console.log("title:" + this.state.newTitle);
      console.log("year:" + this.state.newYear); 

        const conferenceRegInst = await conferenceReg.deployed()//.then((instance) => {
        //this.conferenceRegInst = instance
        return await conferenceRegInst.create(this.state.newTitle, this.state.newYear, this.state.ipfsHash, {from: accounts[0], gas: 4700000});
          }).catch(function(err) {
        console.log(err.message);
      });
    }) //await ipfs.add



  };

  updateNewTitle(evt) {
    this.setState({newTitle: evt.target.value});
  };

  updateNewYear(evt) {
    this.setState({newYear: evt.target.value});
  }



	render(){
		return(
      <div className="IpfsUpload">

			<form className="createEventForm" onSubmit={this.onSubmit}>
			  <div className="form-group">
			    <p>Conference Name</p>
			    <input value={this.state.newTitle} onChange={evt => this.updateNewTitle(evt)} type="text" className="form-control" id="formGroupExampleInput" placeholder="My Conference"></input>
          <input value={this.state.newYear} onChange={evt => this.updateNewYear(evt)} type="text" className="form-control" id="formGroupExampleInput" placeholder="Year"></input>
			   <input type="file" onChange={this.captureFile} />
        </div>
				<button type="submit" className="btn btn-primary">Create</button>
      </form>
 
     </div>
		);
	}
}


export default CreateEventForm