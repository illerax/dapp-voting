const {ethers, run, network} = require("hardhat");

async function main() {

    const Voting = await ethers.getContractFactory("Voting");
    const contract = await Voting.deploy();
    await contract.deployed();
    console.log("Token address:", contract.address);

    console.log(network.config);
    if(network.config.chainId === 97){
        await contract.deployTransaction.wait(6);
        await verify(contract.address, [])
    }
}

async function verify(contractAddress, arguments) {
    await run("verify:verify", {
        address: contractAddress,
        constructorArguments: arguments
    })
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
