pragma solidity ^0.4.21;

contract Review{

	address public reviewer;
	int8 public score;
	// IpfsMultihash
	bytes32 public digest;
	uint8 public hashFunction;
	uint8 public size;

	

	function Review(address _reviewer, int8 _score, bytes32 _digest, uint8 _hashFunction, uint8 _size) public {
		score = _score;
		reviewer = _reviewer;
		digest = _digest;
		hashFunction = _hashFunction;
		size = _size;
	}
}
