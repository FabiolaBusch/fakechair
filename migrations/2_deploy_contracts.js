//var User = artifacts.require("./User.sol");
var ConferenceRegistry = artifacts.require("./ConferenceRegistry.sol");
var Conference = artifacts.require("./Conference.sol")
var Contract = artifacts.require("./Contract.sol")


var id = 0;
var address = "0x36029d569bcb0550b27277bd37ADFc7eb23cC6dD";
var title = web3.fromAscii("Title0");
var year = 0;
var digest = 0;
var hashFunction = 0;
var size = 0;

var authors = [];
var pcmembers = [];

module.exports = function(deployer) {
  deployer.deploy(Conference, title, year, digest, hashFunction, size);
  deployer.deploy(ConferenceRegistry);
  deployer.deploy(Contract);
};
