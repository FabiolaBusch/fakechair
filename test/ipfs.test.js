const expectThrow = require('./helpers/expectThrow');
const expectEvent = require('./helpers/expectEvent');
const ipfs = require('../src/ipfs');


require('chai')
  .use(require('chai-as-promised'))
  .should();

  
const initialTitle = 'MyTestConference';
const initialYear = 2018;
const initialIpfsHash = "QmTUERxij8NJRirYfPqKQQWSGwwMLctABzgCwLnV6H215F";
const buffer= null;

// open file, store on ipfs

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
      this.buffer = buffer;
  };


  before(async () => {
    await ipfs.add(this.buffer);

  });

  context('in normal conditions', () => {
    it('is possible to cat content of file', async () => {

      await ipfs.cat( )
        .should.be.fulfilled;
    }); 
  });


  context('in adversarial conditions', () => {

  });

