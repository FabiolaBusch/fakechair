pragma solidity ^0.4.21;

import './RBACWithAdmin.sol';
import './utils/BytesUtils.sol';
import './Paper.sol';


/**
 * @title Conference
 * @dev A Conference with basic properties (title, year).
 * @dev An unique Id, which is the SHA-256 hash of title and year
 * @dev is used to retrieve the conference in ConferenceRegistry
 * @dev Uses RBAC, which emits events like 'RoleAdded' and 'RoleRemoved'
 * @dev when an Author or PCmember is added.
 */
contract Conference is RBACWithAdmin{

	event ConferenceAdded (bytes32 digest, uint8 hashFunction, uint8 size);
	event PaperAdded (address author, bytes32 digest, uint8 hashFunction, uint8 size);

	Paper[] public paper;

	// ROLE_ADMIN already part of RBAC
	string constant ROLE_AUTHOR = "author";
  	string constant ROLE_PCMEMBER = "pcmember";

  	//@devs use bytes32, it can be passed out of contract, bytes not
  	bytes32 public id; // Hash of title and year of conference, should be unique
	bytes32 public title; // limited length, less than 33 chars
	uint public year;
	bytes32 public digest;
    uint8 public hashFunction;
    uint8 public size;
    address public admin; 

	

	function Conference(address _admin, string _title, uint _year, bytes32 _digest, uint8 _hashFunction, uint8 _size) public {
		require(bytes(_title).length <= 32);

		addRole(_admin, ROLE_ADMIN);
		id = sha256(_title, _year);
		year = _year;
		title = BytesUtils.stringToBytes32(_title); // need title of >= 32 chars, to fit in bytes32
		digest = _digest;
		hashFunction = _hashFunction;
		size = _size;
		admin = _admin;
		emit ConferenceAdded(_digest, _hashFunction, _size);
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

  	modifier onlyAuthor()
	  {
	    require(
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
			addRole(addr[i], ROLE_PCMEMBER);
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


  	function addPaper(address _author, bytes32 _title, bytes32 _digest, uint8 _hashFunction, uint8 _size) onlyAuthor public {
		paper.push(new Paper(_author, _title, _digest, _hashFunction, _size));

		emit PaperAdded(_author, _digest, _hashFunction, _size);
	}

	function getPaperByIndex(uint8 _index) public constant 
		returns (Paper, address, bytes32, bytes32, uint8, uint8){

		return (
		      paper[_index],
		      paper[_index].author(),
		      paper[_index].title(),
		      paper[_index].digest(),
		      paper[_index].hashFunction(),
		      paper[_index].size()

		);
	}

	function getPaperLength() public constant returns (uint){
	    return paper.length;
	}


}
