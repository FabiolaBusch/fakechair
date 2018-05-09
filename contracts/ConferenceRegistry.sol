pragma solidity ^0.4.21;

import "./Conference.sol";

// create and manage list of all conferences


// remove and expire conferences
// set id automatically -> number increasing or a hash, has to be unique!!
// add year
contract ConferenceRegistry {

  	address public owner;
  	Conference[] public conferences;

  	event ConferenceCreated(uint id, string title, bytes32 ipfsHash);

  
  	function ConferenceRegistry() public{
	    // Defines fakechair admin address - may be removed for public deployment
	    owner = msg.sender;
	}

	modifier isOwner() {
    	require (msg.sender == owner);
    	_;
	}

	function conferencesLength()
	    public
	    constant
	    returns (uint)
	  {
	      return conferences.length;
	}

	  function getConference(uint _index)
	    public
	    constant
	    returns (Conference, uint, bytes32,bytes32)
	  {
	    // Test in truffle deelop:
	    // ListingsRegistry.deployed().then(function(instance){ return instance.getListing.call(0) })

	    // TODO (Stan): Determine if less gas to do one array lookup into var, and
	    // return var struct parts
	    return (
		      conferences[_index],
		      conferences[_index].id(),
		      conferences[_index].title(),
		      conferences[_index].ipfsHash()
		);

	}

	function create(
	    uint _id,
	    string _title,
	    bytes32 _ipfsHash
	  )
	    public
	    returns (uint)
	  {
	  	//require(bytes(_title).length <= 32);
	    conferences.push(new Conference(_id, _title, _ipfsHash));
	    emit ConferenceCreated(_id, _title, _ipfsHash);
	    return conferences.length;
	}

	/*function delete(
	    uint _id
	  )
	    public
	    returns (uint)
	  {
	    conferences.push(new Conference(_id, _title, _ipfsHash));
	    emit ConferenceCreated(_id, _title, _ipfsHash);
	    return conferences.length;
	}*/



}