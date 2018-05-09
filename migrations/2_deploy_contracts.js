//var User = artifacts.require("./User.sol");
var ConferenceRegistry = artifacts.require("./ConferenceRegistry.sol");
var Conference = artifacts.require("./Conference.sol")
var SimpleStorage = artifacts.require("./SimpleStorage.sol")


var id = 0;
var address = "0x36029d569bcb0550b27277bd37ADFc7eb23cC6dD";
var title = web3.fromAscii("Title0");
var ipfsHash = "";

var authors = [];
var pcmembers = [];

module.exports = function(deployer) {
  deployer.deploy(Conference, id, title, ipfsHash);
  deployer.deploy(ConferenceRegistry);
  deployer.deploy(SimpleStorage);
};
