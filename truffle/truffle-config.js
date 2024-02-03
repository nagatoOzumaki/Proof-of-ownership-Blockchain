module.exports = {
  contracts_build_directory: "../client/src/contracts",
  networks: {
    development: {
      host: "127.0.0.1",
      port: 8545,
      network_id: "*"
    },
    /*loc_test_test: {
      network_id: "*",
      port: 8545,
      host: "127.0.0.1"
    }*/
  },
  mocha: {},
  compilers: {
    solc: {
      version: "0.8.18"
    }
  }
};
