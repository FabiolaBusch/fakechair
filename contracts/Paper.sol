pragma solidity ^0.4.21;

import './Review.sol';


contract Paper{

	address public author;
	bytes32 public title;
	// IpfsMultihash
	bytes32 public digest;
	uint8 public hashFunction;
	uint8 public size;

	Review[] public reviews;

	event ReviewAdded (address reviewer, int8 score, bytes32 digest, uint8 hashFunction, uint8 size);

	function Paper(address _author, bytes32 _title, bytes32 _digest, uint8 _hashFunction, uint8 _size) public {
		title = _title;
		author = _author;
		digest = _digest;
		hashFunction = _hashFunction;
		size = _size;
	}


  	/**
  	 * Public functions
  	 */

  	 // Author cannot add own review. Any other methods are not specified (e.g. it is still possible for non-members to add a review).
	function addReview(address _reviewer, int8 _score, bytes32 _digest, uint8 _hashFunction, uint8 _size) public {
		require(_reviewer != author);

		reviews.push(new Review(_reviewer, _score, _digest, _hashFunction,  _size));
		emit ReviewAdded(_reviewer, _score,_digest, _hashFunction,  _size);
	}

	function getReviewByIndex(uint _index) public constant returns (Review, address, int8, bytes32, uint8, uint8){
		return (
		      reviews[_index],
		      reviews[_index].reviewer(),
		      reviews[_index].score(),
		      reviews[_index].digest(),
		      reviews[_index].hashFunction(),
		      reviews[_index].size()
		);
	}

	function getReviewsLength() public constant returns (uint){
	    return reviews.length;
	}


  	 // addReviewer
  	 // add author
  	 // add review

}
