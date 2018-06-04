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
      from: "0x4b1b13B69B85D6EdDBC0Be7A194E2edb6E05340a"
    }
  },
  rpc: {
    host: "127.0.0.1",
    port: 8545
  }
 // to customize your Truffle configuration!
};
