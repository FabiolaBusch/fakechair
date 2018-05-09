pragma solidity ^0.4.18;

contract User {
  	address user;
	string public name;

  
	// Name is not required. Register user, when button "Register" is clicked
	function registerUser(string n) public {
		user = msg.sender;
		name = n;
	}


		// user can set her own name, optionally
	function getName() public view returns (string){
		require(msg.sender == user);

		return name;
	}


	// Check if current user/account (logged in MetaMask) is registered
	function isRegistered() public view returns (bool){
		if(user != msg.sender){
			return false;
		}
		return true;
	}


}
