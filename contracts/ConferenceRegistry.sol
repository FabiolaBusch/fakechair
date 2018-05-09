pragma solidity ^0.4.21;

import "./Conference.sol";
import "./utils/BytesUtils.sol";

// in mapping 0 is part of indexes!!!
// first conference created receives index 0 

/**
 * @title ConferenceRegistry
 * @dev Manages available conferences. Adds, gets, removes conferences. 
 */
contract ConferenceRegistry{

  	/**
  	 * Events
  	 */

  	event ConferenceCreated(string title, uint year, bytes32 ipfsHash);
  	event ConferenceRemoved(string title, uint year);

  	/**
  	 * Storage
  	 */
  	
  	Conference[] public conferences;
  	// Maps unique Id to index in conference array
  	mapping(bytes32 => uint) public conferenceIndex;
  	bytes32 tempId;

  	/**
  	 * Public functions
  	 */

	function conferencesLength() public constant returns (uint) {
	    return conferences.length;
	}

	/**
	 * @dev Uses unique id (SHA-256 of title and year) to lookup conference
	 * @dev in storage.
	 * @param  _title string, conference title
	 * @param  _year uint, conference year
	 * @return Conference, bytes32, bytes32, uint, bytes32 . Conference, Id, title, year, IpsfHash
	 */
	function getConference(string _title, uint _year) public constant 
		returns (Conference, bytes32, bytes32, uint, bytes32){

	    uint _index = conferenceIndex[sha256(_title,_year)];

	    return (
		      conferences[_index],
		      conferences[_index].id(),
		      conferences[_index].title(),
		      conferences[_index].year(),
		      conferences[_index].ipfsHash()
		);
	}


	/** 
	 * @dev Creates a new conference with SHA-256 Id, adds it to storage, adds index in 
	 * @dev conferenceIndex mapping and emits "ConferenceCreated" event.
	 * @dev requires SHA-256 of title and year to be unique!
	 * 
	 * @param  _title string, required length <= 32 chars
	 * @param  _year uint
	 * @param  _ipfsHash bytes32 
	 * @return conferences.length uint (number of conferences)
	 */
	function create(string _title, uint _year, bytes32 _ipfsHash) public returns (uint) {

		tempId = sha256(_title, _year);
		require(conferenceIndex[tempId] == 0); // empty mapping is initialized to 0

		// If unique, store index and push it to storage
	  	conferenceIndex[tempId] = conferences.length;
		conferences.push(new Conference(_title, _year, _ipfsHash));

	    emit ConferenceCreated(_title, _year, _ipfsHash);
	    return conferences.length;
	}

	// does not work yet
	/**
	 * @dev remove a conference using (title, year) as identifier. Remove
	 * @dev the entry from storage array, update the array and fill the empty gap
	 * @dev with the last array entry. Update the Id -> Index mapping. Emit 
	 * @dev 'ConferenceRemoved' event.
	 * 
	 * @param  _title title of the conference to remove
	 * @param  _year year of the conference to remove
	 * @return conferences.length amount of conferences available
	 */
	function remove(string _title, uint _year) public returns (uint)
	  {
	    tempId = sha256(_title,_year);
	    uint removedIndex = conferenceIndex[tempId];
	    require(removedIndex > 0); // Conference needs to exist to be removed!

	    Conference conf;
	    bytes32 title;
	    bytes32 id;
	    uint year;
	    bytes32 ipsfHash;



	    (conf, id, title, year, ipsfHash) = getConference(_title, _year);
	    require(conf.hasRole(msg.sender, 'admin')); // Only admin can remove conference

	    // remove conference from mapping
	    conferenceIndex[tempId] = 0;

	    // Remove conference from storage
	    // To fill the gap: put last entry in place
	    bytes32 lastId = conferences[conferences.length - 1].id();

	    // Overwrite place in storage array 
	    conferences[removedIndex] = conferences[conferences.length];
	    conferences.length--;
	    // Update Mapping
	    conferenceIndex[lastId] = removedIndex;

	    emit ConferenceRemoved(_title, _year);
	    return conferences.length;
	}



}
