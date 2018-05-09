pragma solidity ^0.4.21;

import './RBACWithAdmin.sol';
import './utils/BytesUtils.sol';

/**
 * @title Conference
 * @dev A Conference with basic properties (title, year).
 * @dev An unique Id, which is the SHA-256 hash of title and year
 * @dev is used to retrieve the conference in ConferenceRegistry
 * @dev Uses RBAC, which emits events like 'RoleAdded' and 'RoleRemoved'
 * @dev when an Author or PCmember is added.
 */
contract Conference is RBACWithAdmin{

	// ROLE_ADMIN already part of RBAC
	string constant ROLE_AUTHOR = "author";
  	string constant ROLE_PCMEMBER = "pcmember";

  	//@devs use bytes32, it can be passed out of contract, bytes not
  	bytes32 public id; // Hash of title and year of conference, should be unique
	bytes32 public title; // limited length, less than 33 chars
	bytes32 public ipfsHash; // to be implemented
	uint public year;

	function Conference(string _title, uint _year, bytes32 _ipfsHash) public {
		require(bytes(_title).length <= 32);

		addRole(msg.sender, ROLE_ADMIN);
		id = sha256(_title, _year);
		year = _year;
		title = BytesUtils.stringToBytes32(_title); // need title of >= 32 chars, to fit in bytes32
		ipfsHash = _ipfsHash;
	}


	/**
	 * Modifier
	 */

	modifier onlyAdminOrPCmember()
	  {
	    require(
	      hasRole(msg.sender, ROLE_ADMIN) ||
	      hasRole(msg.sender, ROLE_PCMEMBER)
    	);
    	_;
  	}

  	modifier onlyMember()
	  {
	    require(
	      hasRole(msg.sender, ROLE_ADMIN) ||
	      hasRole(msg.sender, ROLE_PCMEMBER) || 
	      hasRole(msg.sender, ROLE_AUTHOR)
    	);
    	_;
  	}

  	/**
  	 * Public functions
  	 */

  	/**
  	 * @dev Allowed for admin/chair or PCmember, emits 'RoleAdded'
  	 * @param addr the address of the soon-to-be author
  	 */
	function addAuthors(address[] addr) onlyAdminOrPCmember public{
		for(uint256 i=0;i<addr.length;i++){
			addRole(addr[i], ROLE_AUTHOR);
		}
	}

	/**
	 * @dev Only allowed for admin/ chair, emits 'RoleAdded'
	 * @param addr the address of the soon-to-be PCmember
	 */
	function addPCmembers(address[] addr) public {
		for(uint256 i=0;i<addr.length;i++){
			adminAddRole(addr[i], ROLE_PCMEMBER);
		}
	}

	/**
	 * @param  addr address of member to be removed
	 * 
	 */
  	function removePCmember(address addr) onlyAdmin public {
	    // revert if the user isn't an pcmember
	    checkRole(addr, ROLE_PCMEMBER);

	    // remove the PCmembers role
	    removeRole(addr, ROLE_PCMEMBER);
  	}

    function removeAuthor(address addr) onlyAdminOrPCmember public {
	    // revert if the user isn't an author
	    checkRole(addr, ROLE_AUTHOR);

	    // remove the authors role
	    removeRole(addr, ROLE_AUTHOR);
  	}

  	function sendHash(string x) public {
   		ipfsHash = BytesUtils.stringToBytes32(x);
 	}

 	// was originally a string
 	function getHash() public view returns (bytes32 x) {
   		return ipfsHash;
 	}
}
