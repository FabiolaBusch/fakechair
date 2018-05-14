const expectThrow = require('./helpers/expectThrow');
const expectEvent = require('./helpers/expectEvent');

const ConferenceRegistry = artifacts.require('ConferenceRegistry');

require('chai')
  .use(require('chai-as-promised'))
  .should();


contract('ConferenceRegistry', function (accounts) {
  let instance;

  const initialTitle = 'MyTestConference';
  const initialYear = 2018;
  const initialIpfsHash = "QnTUERxij8NJRirYfPqKQQWSGwwMLctABzgCwLnV6H215F";

  const _title1 = 'MyTestConference1';
  const _year1 = 2017;
  const _year2 = 2016;
  const _year3 = 2015;
  const _ipfsHash1 = "QmTUERxij8NJRirYfPqKQQWSGwwMLctABzgCwLnV6H215F";


  before(async () => {
    instance = await ConferenceRegistry.new({ from: accounts[0] });
    await instance.create(initialTitle, initialYear, initialIpfsHash, { from: accounts[0] });
  });

  context('in normal conditions', () => {
    it('is possible to create a new conference for admin', async () => {
      await instance.create( _title1, _year1, _ipfsHash1, { from: accounts[0] })
        .should.be.fulfilled;
    });   
    it('is possible to create a new conference for anyone', async () => {
      await instance.create(_title1, _year2, _ipfsHash1, { from: accounts[1] })
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
    it('is possible to get a conference\'s id, title and ipfsHash for anyone', async () => {
      let [conf, id, title, year, ipfsHash] = await instance.getConference(initialTitle, initialYear, { from: accounts[1] });
      let cleanTitle = web3.toAscii('0' + title.split('0')[1]); // convert bytes32 to string, remove zero padding

      //assert.equal(initialId,id,'Id is correct');
      assert.equal(initialTitle, cleanTitle, 'Title is correct');
      assert.equal(initialYear, year, 'Year is correct');
      assert.equal(initialIpfsHash, ipfsHash, 'IpfsHash is correct');
    });

    it('announces a ConferenceCreated event on create', async () => {
      await expectEvent.inTransaction(
        instance.create(_title1, _year3, _ipfsHash1, { from: accounts[0] }),
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
      await expectThrow.expectThrow(
        instance.create('A very long title with 33 chars .', _year1, _ipfsHash1, { from: accounts[0] })
      );
    });
    it('is not possible to create two similar conferences', async () => {
      await expectThrow.expectThrow(
        instance.create(_title1, _year1, _ipfsHash1, { from: accounts[0] })
      );
    });
    /*it('is not possible to remove a conference by anyone', async () => {
      await instance.remove(_title1, _year2, { from: accounts[2] })
      .should.be.fulfilled;
    });*/

  });
});
