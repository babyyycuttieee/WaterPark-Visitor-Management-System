const MongoClient = require("mongodb").MongoClient;
const User = require("./user")

const { faker } = require('@faker-js/faker');
const bcrypt = require("bcryptjs");
const saltRounds = 10;
let encryptedPassword;


const username = faker.name.findName();
const userpassword = faker.internet.password();
const name = faker.name.findName();
const email = faker.internet.email();
const phonenumber = faker.phone.phoneNumber('601#-#######');
const staffunit = faker.random.numeric(9);


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

	const jwt = require('jsonwebtoken');
	//const Security = require("./security");
	function generateAccessToken(payload) {
	  return jwt.sign(payload, "ainincantik", {expiresIn:'1h'});
	}

describe("User Account", () => {
	let client;
	beforeAll(async () => {
		client = await MongoClient.connect(
			"mongodb+srv://m001-student:m001-mongodb-basics@sandbox.tlq8x.mongodb.net/myFirstDatabase?retryWrites=true&w=majority",
			{ useNewUrlParser: true },
		);
		User.injectDB(client);
	})
	afterAll(async () => {
		await client.close();
	})

	test("New staff registration", async () => {
		const res = await User.register(username,userpassword,name,email,phonenumber,staffunit,"staff",encryptedPassword)
		expect(res).toBe("Successfully, create new staff's account")
	})

	test("Duplicate username", async () => {
		const res = await User.register(username,userpassword,name,email,phonenumber,staffunit,"staff",encryptedPassword)
		expect(res).toBe("Username exist")
	})

	test("Staff login invalid username", async () => {
		const res = await User.login("Anya",userpassword)
		expect(res).toBe("The Username is invalid")
	})

	test("Staff login invalid password", async () => {
		const res = await User.login("Robyn Deckow","enMwT_9lWG7awg")
		expect(res).toBe("The Password is invalid")
	})

	test("Username doesn't exist to login", async () => {
		const res = await User.login("Forger","1234")
		expect(res).toBe("Invalid Input");
	  })

	test("Staff login successfully", async () => {
		const res = await User.login(username,userpassword)
		expect(res.username).toBe(username)
		expect(res.userpassword).toBe(userpassword)
	})

    test("Update staff", async () => {
        const res = await User.update("Juanita Farrell DVM")
        expect(res).toBe("Update success")
    })

	// test("Delete staff's acount",async () =>{
    //     const res = await User.delete("Beatrice Baumbach","HzynxG_WHkkt6wQ")
    //     expect(res).toBe("Data deleted successfully")
    // })

    // test("Delete staff's acount failed",async () =>{
    //     const res = await User.delete("Anya","3qQVTGBIALmqK5")
    //     expect(res).toBe("Invalid input")
    // });

	test("View staff's detail",async () =>{
		const res = await User.view(username)
		expect(res).toBe("Username view")
	})
});

function verifyToken(req,res,next){
	const authHeader=req.headers['authorization']
	const token = authHeader && authHeader.split(' ')[1]
  
	jwt.verify(token, "ainincantik", (err,user)=>{
	  console.log(err)
  
	  if (err) return res.sendStatus(401)
  
	  req.user = user
  
	  next()
	})
  }
