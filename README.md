# Voting dApp

Voting application on BNB Chain

## Demo
**Application**: [https://illerax.github.io/dapp-voting/](https://illerax.github.io/dapp-voting/)

**Contract**: [https://testnet.bscscan.com/address/0x0892c7e18354cc66ee328ddcd54d9a07700a89ff](https://testnet.bscscan.com/address/0x0892c7e18354cc66ee328ddcd54d9a07700a89ff)


## Contracts

### Development

```shell
npx hardhat help
npx hardhat test
REPORT_GAS=true npx hardhat test
npx hardhat node
npx hardhat run scripts/deploy.js
```

### Deploy to BNB testnet

1. Configure environment variables
    - BNB_TESTNET_RPC_URL
    - BNB_TESTNET_PRIVATE_KEY
    - BSCSCAN_API_KEY
2. Run deploy script
```shell
npx hardhat run scripts/deploy.js --network bnbtestnet
```

## Frontend

### Development
```shell
npm --prefix frontend start
```

### Deploy
```shell
npm --prefix frontend run deploy
```