const { assert } = require("chai");

const Instablock = artifacts.require("./Instablock.sol");

require("chai")
	.use(require("chai-as-promised"))
	.should();

contract("Instablock", ([deployer, author, tipper]) => {
	let instablock;

	before(async () => {
		instablock = await Instablock.deployed();
	});

	describe("deployment", async () => {
		it("deploys successfully", async () => {
			const address = await instablock.address;
			assert.notEqual(address, 0x0);
			assert.notEqual(address, "");
			assert.notEqual(address, null);
			assert.notEqual(address, undefined);
		});

		it("has a name", async () => {
			const name = await instablock.name();
			assert.equal(name, "Instablock");
		});
	});

	describe("images", async () => {
		let result, imageCount;
		const hash = "abc123";

		before(async () => {
			result = await instablock.uploadImage(hash, "Image description", {
				from: author,
			});
			imageCount = await instablock.imageCount();
		});

		it("creates images", async () => {
			//SUCCESS
			assert.equal(imageCount, 1);
			const event = result.logs[0].args;
			assert.equal(
				event.id.toNumber(),
				imageCount.toNumber(),
				"id is correct"
			);
			assert.equal(event.hash, hash, "Hash is correct");
			assert.equal(
				event.description,
				"Image description",
				"description is correct"
			);
			assert.equal(event.tipAmount, "0", "ti amount is correct");
			assert.equal(event.author, author, "author is correct");

			//FAILURE:  Image must have hash
			await instablock.uploadImage("", "Image description", {
				from: author,
			}).should.be.rejected;

			//FAILURE:  Image must have description
			await instablock.uploadImage("Image hash", "", {
				from: author,
			}).should.be.rejected;
		});
		//Check from Struct
		it("lists images", async () => {
			const image = await instablock.images(imageCount);
			assert.equal(
				image.id.toNumber(),
				imageCount.toNumber(),
				"id is correct"
			);
			assert.equal(image.hash, hash, "Hash is correct");
			assert.equal(
				image.description,
				"Image description",
				"description is correct"
			);
			assert.equal(image.tipAmount, "0", "tip amount is correct");
			assert.equal(image.author, author, "author is correct");
		});
	});
});
