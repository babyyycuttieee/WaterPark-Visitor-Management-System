const MongoClient = require("mongodb").MongoClient;
const Management = require("./security")

// const { faker } = require('@faker-js/faker');

// const managername = faker.name.findName();
// const managerpassword = faker.internet.password();
// const name = faker.name.findName();
// const email = faker.internet.email();
// const phonenumber = faker.phone.phoneNumber('601#-#######');

const jwt = require('jsonwebtoken');
function generateAccessToken(payload) {
  return jwt.sign(payload, "ainincantik", {expiresIn:'1h'});
}

describe("User Account", () =>{
    let client;
    beforeAll(async () =>{
        client = await MongoClient.connect(
			"mongodb+srv://m001-student:m001-mongodb-basics@sandbox.tlq8x.mongodb.net/myFirstDatabase?retryWrites=true&w=majority",
			{ useNewUrlParser: true },
		);
		Management.injectDB(client);
	})
	afterAll(async () => {
		await client.close();
	})

	test("Management login invalid username", async () => {
		const res = await Management.login("Anya","kOrLkU8mt9buM0J")
		expect(res).toBe("The Username is invalid")
	})

	test("Management login invalid password", async () => {
		const res = await Management.login("Rufus Gerlach","enMwT_9lWG7awg")
		expect(res).toBe("The Password is invalid")
	})

	test("Username doesn't exist to login", async () => {
		const res = await Management.login("Forger","kOrLkU8mt9buM0")
		expect(res).toBe("Invalid Input");
	  })

	test("Management login successfully", async () => {
		const res = await Management.login("Rufus Gerlach", "kOrLkU8mt9buM0J")
		expect(res.managername).toBe("Rufus Gerlach")
		expect(res.managerpassword).toBe("kOrLkU8mt9buM0J")
		expect(res.role).toBe("management")
	})
});


function verifyToken(req,res,next){
    const authHeader=req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]
  
    jwt.verify(token, "ainincantik", (err,user)=>{
      console.log(err)
  
      if (err) return res.sendStatus(403)
  
      req.user = user
  
      next()
    })
  }
