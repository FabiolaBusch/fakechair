pragma solidity ^0.4.21;

contract Paper{

	event PaperAdded (address author, bytes32 digest, uint8 hashFunction, uint8 size);

	address public author;
	bytes32 public title;
	// IpfsMultihash
	bytes32 public digest;
	uint8 public hashFunction;
	uint8 public size;

	function Paper(address _author, bytes32 _title, bytes32 _digest, uint8 _hashFunction, uint8 _size) public {
		title = _title;
		author = _author;
		digest = _digest;
		hashFunction = _hashFunction;
		size = _size;

		emit PaperAdded(author, digest, hashFunction, size);		
	}


  	/**
  	 * Public functions
  	 */

  	 // addReviewer
  	 // add author
  	 // add review

}
