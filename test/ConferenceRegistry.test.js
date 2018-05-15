const expectThrow = require('./helpers/expectThrow');
const expectEvent = require('./helpers/expectEvent');
const multihash = require('../src/utils/multihash');

const ConferenceRegistry = artifacts.require('ConferenceRegistry');

require('chai')
  .use(require('chai-as-promised'))
  .should();


contract('ConferenceRegistry', function (accounts) {
  let instance;

  const initialTitle = 'MyTestConference';
  const initialYear = 2018;
  const initialIpfsHash = "QmTUERxij8NJRirYfPqKQQWSGwwMLctABzgCwLnV6H215F";

  const _title1 = 'MyTestConference1';
  const _year1 = 2017;
  const _year2 = 2016;
  const _year3 = 2015;
  const _ipfsHash1 = "QmTUERxij8NJRirYfPqKQQWSGwwMLctABzgCwLnV6H215F";


  before(async () => {
    instance = await ConferenceRegistry.new({ from: accounts[0] });
    let { digest, hashFunction, size } = multihash.getBytes32FromMultiash(initialIpfsHash);

    await instance.create(initialTitle, initialYear, digest, hashFunction, size, { from: accounts[0] });
  });

  context('in normal conditions', () => {
    it('is possible to create a new conference for admin', async () => {
      let { digest, hashFunction, size } = multihash.getBytes32FromMultiash(_ipfsHash1);

      await instance.create( _title1, _year1, digest, hashFunction, size , { from: accounts[0] })
        .should.be.fulfilled;
    });   
    it('is possible to create a new conference for anyone', async () => {
      let { digest, hashFunction, size } = multihash.getBytes32FromMultiash(_ipfsHash1);

      await instance.create(_title1, _year2, digest, hashFunction, size , { from: accounts[1] })
        .should.be.fulfilled;// what does it return ?? eventuell gucken ob richtige length zurückgegeben wird
    });
    it('is possible to retrieve the number of conferences for anyone', async () => {
      let length = await instance.conferencesLength({ from: accounts[1] })
      assert.equal(3,length.c[0]);
    });
    /*it('is possible to remove a conference for its creator', async () => {
      await instance.remove(_title1, _year2, { from: accounts[1] })
      .should.be.fulfilled;
    });*/
    it('is possible to get a conference\'s id, title, digest, hashFunction and size for anyone', async () => {
      let [conf, id, title, year, _digest, _hashFunction, _size ] = await instance.getConference(initialTitle, initialYear, { from: accounts[1] });
      let cleanTitle = web3.toAscii('0' + title.split('0')[1]); // convert bytes32 to string, remove zero padding
      let { digest, hashFunction, size } = multihash.getBytes32FromMultiash(initialIpfsHash);

      //assert.equal(initialId,id,'Id is correct');
      assert.equal(initialTitle, cleanTitle, 'Title is correct');
      assert.equal(initialYear, year, 'Year is correct');
      assert.equal(digest, _digest, 'IPFS digest is correct');
      assert.equal(hashFunction, _hashFunction, 'IPFS hash function is correct');
      assert.equal(size, _size, 'IPFS size is correct');
    });

    it('announces a ConferenceCreated event on create', async () => {
      let { digest, hashFunction, size } = multihash.getBytes32FromMultiash(_ipfsHash1);

      await expectEvent.inTransaction(
        instance.create(_title1, _year3, digest, hashFunction, size, { from: accounts[0] }),
        'ConferenceCreated' /*Event name */
      );
    });
    /*it('announces a ConferenceRemoved event on remove', async () => {
      await expectEvent.inTransaction(
        instance.remove(_title1, _year3, { from: accounts[0] }),
        'ConferenceRemoved' 
      );
    });*/
  });


  context('in adversarial conditions', () => {
    it('does not allow a title longer than 32 characters', async () => {
      let { digest, hashFunction, size } = multihash.getBytes32FromMultiash(_ipfsHash1);

      await expectThrow.expectThrow(
        instance.create('A very long title with 33 chars .', _year1, digest, hashFunction, size, { from: accounts[0] })
      );
    });
    it('is not possible to create two similar conferences', async () => {
      let { digest, hashFunction, size } = multihash.getBytes32FromMultiash(_ipfsHash1);

      await expectThrow.expectThrow(
        instance.create(_title1, _year1, digest, hashFunction, size, { from: accounts[0] })
      );
    });
    /*it('is not possible to remove a conference by anyone', async () => {
      await instance.remove(_title1, _year2, { from: accounts[2] })
      .should.be.fulfilled;
    });*/

  });
});
