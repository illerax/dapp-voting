const {
    loadFixture,
} = require("@nomicfoundation/hardhat-network-helpers");
const {expect} = require("chai");

describe("Voting", function () {

    async function deployFixture() {

        const [owner, otherAccount1, otherAccount2] = await ethers.getSigners();
        const Voting = await ethers.getContractFactory("Voting");
        const contract = await Voting.deploy();
        await contract.deployed();

        return {contract, owner, otherAccount1, otherAccount2};
    }

    describe("Deployment", function () {

        it("Should create token with correct initial values", async function () {
            const {contract} = await loadFixture(deployFixture);
            expect(await contract.getSessionsList())
                .to.equal("");
            await expect(contract.vote("something"))
                .to.be.revertedWith("Sorry, there are no voting sessions at this time");
            await expect(contract.getVoteResults())
                .to.be.revertedWith("Sorry, there are no voting sessions at this time");
            await expect(contract.getVoteResultsBySessionId(0))
                .to.be.revertedWith("Sorry, there are no voting sessions at this time");
        });

    });

    describe("Voting", function () {

        it("Should create voting session with options", async function () {
            const {contract} = await loadFixture(deployFixture);

            await contract.createSession("topic1", ["option1", "option2"]);

            expect(await contract.getSessionsList())
                .to.equal("0:topic1;");
        });

        it("Should return voting sessions list", async function () {
            const {contract} = await loadFixture(deployFixture);

            await contract.createSession("topic1", ["option1", "option2"]);
            await contract.createSession("topic2", ["option1", "option2"]);
            await contract.createSession("topic3", ["option1", "option2"]);
            await contract.createSession("topic4", ["option1", "option2"]);
            await contract.createSession("topic5", ["option1", "option2"]);

            expect(await contract.getSessionsList())
                .to.equal("0:topic1;1:topic2;2:topic3;3:topic4;4:topic5;");
        });

        it("Should store vote and return current voting session results", async function () {
            const {contract, otherAccount1, otherAccount2} = await loadFixture(deployFixture);

            await contract.createSession("topic1", ["option1", "option2"]);
            await contract.vote("option1");

            expect(await contract.getVoteResults())
                .to.equal("option1:1;option2:0;");

            await contract.connect(otherAccount1).vote("option1");
            await contract.connect(otherAccount2).vote("option2");

            expect(await contract.getVoteResults())
                .to.equal("option1:2;option2:1;");
        });

        it("Should not allow to vote twice during single voting session", async function () {
            const {contract, owner} = await loadFixture(deployFixture);

            await contract.createSession("topic1", ["option1", "option2"]);

            await contract.connect(owner).vote("option1");

            await expect(contract.connect(owner).vote("option2"))
                .to.be.revertedWith("You have already voted");
        });

        it("Should return historical voting session results", async function () {
            const {contract, owner, otherAccount1, otherAccount2} = await loadFixture(deployFixture);

            await contract.createSession("topic1", ["option1", "option2"]);
            await contract.connect(owner).vote("option1");
            await contract.connect(otherAccount1).vote("option1");
            await contract.connect(otherAccount2).vote("option2");

            await contract.createSession("topic2", ["option3", "option4"]);

            await expect(contract.getVoteResultsBySessionId(2))
                .to.be.revertedWith("There is no session with such Id");

            expect(await contract.getVoteResultsBySessionId(1))
                .to.equal(await contract.getVoteResults());

            expect(await contract.getVoteResultsBySessionId(0))
                .to.equal("option1:2;option2:1;");

            await expect(contract.getVoteResultsBySessionId(-1))
                .to.be.revertedWith("Id should be positive");
        });

    });


});
