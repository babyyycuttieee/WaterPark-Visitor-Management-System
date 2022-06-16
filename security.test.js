const MongoClient = require("mongodb").MongoClient;
const Security = require("./user")

const { faker } = require('@faker-js/faker');
const bcrypt = require("bcryptjs");
const saltRounds = 10;
let encryptedPassword;


const username = faker.name.findName();
const userpassword = faker.internet.password();

bcrypt.genSalt(saltRounds, function (saltError, salt) {
    if (saltError) {
      throw saltError
    } else {
      bcrypt.hash(userpassword, salt, function(hashError, hash) {
      if (hashError) {
        throw hashError
      } else {
        encryptedPassword = hash;
        //console.log("Hash:",hash);
        
      }
      })
    }
    })

describe("Security Account", () => {
	let client;
	beforeAll(async () => {
		client = await MongoClient.connect(
			"mongodb+srv://m001-student:m001-mongodb-basic@sandbox.cth4i.mongodb.net/myFirstDatabase?retryWrites=true&w=majority",
			{ useNewUrlParser: true },
		);
		Security.injectDB(client);
	})
	afterAll(async () => {
		await client.close();
	})

	test("New management registration", async () => {
		const res = await Security.register(username,userpassword,encryptedPassword)
		expect(res).toBe("Successfully, create new account")
	})

	test("Duplicate username", async () => {
		const res = await Security.register(username,userpassword,encryptedPassword)
		expect(res).toBe("Username exists")
	})

	test("User login invalid username", async () => {
		const res = await Security.login("Anya",userpassword)
		expect(res).toBe("The Username is invalid")
	})

	test("User login invalid password", async () => {
		const res = await Security.login("Anya Forger","lAiZWcKGPp3qQbn")
		expect(res).toBe("The Password is invalid")
	})

	test("Username doesn't exist to login", async () => {
		const res = await Security.login("Forger","1234")
		expect(res).toBe("Invalid Input");
	  })

	test("Management login successfully", async () => {
		const res = await Security.login(username,userpassword)
		expect(res.username).toBe(username)
		expect(res.userpassword).toBe(userpassword)
	})
});