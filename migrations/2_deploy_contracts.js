//var User = artifacts.require("./User.sol");
var ConferenceRegistry = artifacts.require("./ConferenceRegistry.sol");
var Conference = artifacts.require("./Conference.sol")
var Paper = artifacts.require("./Paper.sol")
var Review = artifacts.require("./Review.sol")





var id = 0;
var address = "0x36029d569bcb0550b27277bd37ADFc7eb23cC6dD";
var title = web3.fromAscii("Title0");
var year = 0;
var digest = 0;
var hashFunction = 0;
var size = 0;
var admin = '0xD89C538b5593798e5c66927E1c8F87afeA15497E';

var authors = [];
var pcmembers = [];

module.exports = function(deployer) {
  deployer.deploy(Conference, admin, title, year, digest, hashFunction, size);
  deployer.deploy(ConferenceRegistry);
  deployer.deploy(Paper, admin, title,  digest, hashFunction, size);
  deployer.deploy(Review, admin, -1, digest, hashFunction, size);

};
