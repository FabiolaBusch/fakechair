pragma solidity ^0.4.21;

import './RBACWithAdmin.sol';



// keep title in bytes32 or is bytes also possible? would be easier
contract Conference is RBACWithAdmin{

	string constant ROLE_AUTHOR = "author";
  	string constant ROLE_PCMEMBER = "pcmember";

  	uint public id;
	bytes32 public title;
	bytes32 public ipfsHash;


  	// Constructor
	function Conference(uint _id, string _title, bytes32 _ipfsHash) public {
		require(bytes(_title).length <= 32);

		addRole(msg.sender, ROLE_ADMIN);
		id = _id;
		title = stringToBytes32(_title); // need title of >= 32 chars, to fit in bytes32
		ipfsHash = _ipfsHash;
	}


	// Modifier
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
  	Public Functions 
  	**/


	function addAuthors(address[] addr) onlyAdminOrPCmember public{
		for(uint256 i=0;i<addr.length;i++){
			addRole(addr[i], ROLE_AUTHOR);
		}
	}

	function addPCmembers(address[] addr) public {
		for(uint256 i=0;i<addr.length;i++){
			adminAddRole(addr[i], ROLE_PCMEMBER);
		}
	}

	 // admins can remove any role
  	function removePCmember(address _addr) onlyAdmin public {
	    // revert if the user isn't an pcmember
	    //  (perhaps you want to soft-fail here instead?)
	    checkRole(_addr, ROLE_PCMEMBER);

	    // remove the advisor's role
	    removeRole(_addr, ROLE_PCMEMBER);
  	}

    function removeAuthor(address _addr) onlyAdminOrPCmember public {
	    // revert if the user isn't an author
	    //  (perhaps you want to soft-fail here instead?)
	    checkRole(_addr, ROLE_AUTHOR);

	    // remove the authors role
	    removeRole(_addr, ROLE_AUTHOR);
  	}


  	/* Helpers 

  	*/

  	function stringToBytes32(string memory source) pure internal returns (bytes32 result) {
    bytes memory tempEmptyStringTest = bytes(source);
    if (tempEmptyStringTest.length == 0) {
        return 0x0;
    }

    assembly {
        result := mload(add(source, 32))
    }
}

}
