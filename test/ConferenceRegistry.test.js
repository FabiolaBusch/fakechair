const expectThrow = require('./helpers/expectThrow');
const expectEvent = require('./helpers/expectEvent');

const ConferenceRegistry = artifacts.require('ConferenceRegistry');

require('chai')
  .use(require('chai-as-promised'))
  .should();


contract('ConferenceRegistry', function (accounts) {
  let instance;

  const initialId = 0;
  const initialTitle = 'MyTestConference';
  const initialIpfsHash = "0x6b14cac30356789cd0c39fec0acc2176c3573abdb799f3b17ccc6972ab4d39ba";

  const _id1 = 1;
  const _title1 = 'MyTestConference1';
  const _ipfsHash1 = "0x7b14cac30356789cd0c39fec0acc2176c3573abdb799f3b17ccc6972ab4d39ba";


  before(async () => {
    instance = await ConferenceRegistry.new({ from: accounts[0] });
    await instance.create(initialId, initialTitle, initialIpfsHash, { from: accounts[0] });
  });

  context('in normal conditions', () => {
    it('is possible to create a new conference for admin', async () => {
      await instance.create(_id1, _title1, _ipfsHash1, { from: accounts[0] })
        .should.be.fulfilled;
    });   
    it('is possible to create a new conference for anyone', async () => {
      await instance.create(_id1, _title1, _ipfsHash1, { from: accounts[1] })
        .should.be.fulfilled;// what does it return ?? eventuell gucken ob richtige length zurückgegeben wird
    });
    it('is possible to retrieve the number of conferences for anyone', async () => {
      let length = await instance.conferencesLength({ from: accounts[1] })
      assert.equal(3,length.c[0]);
    });
    it('is possible to get a conference\'s id, title and ipfsHash for anyone', async () => {
      let [conf,id, title, ipfsHash] = await instance.getConference(0, { from: accounts[1] });
      let cleanTitle = web3.toAscii('0' + title.split('0')[1]); // convert bytes32 to string, remove zero padding

      assert.equal(initialId,id,'Id is correct');
      assert.equal(initialTitle, cleanTitle, 'Title is correct');
      assert.equal(initialIpfsHash, ipfsHash, 'IpfsHash is correct');
    });

    it('announces a ConferenceCreated event on create', async () => {
      await expectEvent.inTransaction(
        instance.create(_id1, _title1, _ipfsHash1, { from: accounts[0] }),
        'ConferenceCreated' /*Event name */
      );
    });
  });


  context('in adversarial conditions', () => {
    it('does not allow a title longer than 32 characters', async () => {
      await expectThrow.expectThrow(
        instance.create(4, 'A very long title with 33 chars .', _ipfsHash1, { from: accounts[0] })
      );
    });

  });
});