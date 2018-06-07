module.exports = {
  networks: {
    development: {
      network_id: "*",
      host: "127.0.0.1",
      port: 7545
    },
    live: {
      network_id: 4, // Rinkeby
      host: "127.0.0.1",
      port: 8546,   // Different than the default below
    }
  },
  rpc: {
    host: "127.0.0.1",
    port: 8545
  }
 // to customize your Truffle configuration!
};
