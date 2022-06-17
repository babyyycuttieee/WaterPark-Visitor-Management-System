let security;
const { faker } = require('@faker-js/faker');
const bcrypt = require("bcryptjs");
const req = require('express/lib/request');
const saltRounds = 10;
let encryptedPassword;

class Security {
	static async injectDB(conn) {
		security = await conn.db("ALab7").collection("security")
	}


	static async register(securityusername,userpassword,encryptedPassword,role) {

		bcrypt.genSalt(saltRounds, function (saltError, salt) {
			if (saltError) {
			throw saltError
			} else {
			bcrypt.hash(userpassword, salt, function(hashError, hash) {
			if (hashError) {
			  return hashError
			} else {
			  encryptedPassword = hash;
			  //console.log("Hash:",hash);
			}
			})
			}
			})

		const user = await security.findOne({  
			$and: [{ 
			securityusername: securityusername,       
			userpassword: userpassword,
			}]})
			.then(async user =>{
			// TODO: Check if username exists
			if (user){
				if ( user.securityusername == securityusername )		
				{
					return "Username exists";
				}
			}
			else{
				// TODO: Save user to database
				await security.insertOne({					
					securityusername : securityusername,
					userpassword : userpassword,
					encryptedpassword : encryptedPassword
				})
				return "Successfully, create new management"
			}
		})	
		return user;	
	}

	//login
	static async login(securityusername, userpassword) {

		const user = await security.findOne({$or: [{securityusername : securityusername}, {userpassword : userpassword}]})
		.then(async user =>{
			//console.log(securityusername)
			if (user)
			{													
				if (user.securityusername != securityusername && user.userpassword == userpassword) {		
					return "The Username is invalid";
				}
				else if (user.securityusername == securityusername && user.userpassword != userpassword) 
				{	
					return "The Password is invalid";
				}
				else
				{
					return user;
				}
			}
			else
		{
			return "Invalid Input";
		}
		})
		return user;
	}

	static async delete (securityusername,userpassword){
		return security.findOne({
		  securityusername : securityusername
		}).then(async user =>{
	
		  if (user){
			if (user.userpassword != userpassword){
			  return "The Password is invalid"
			}
			else {
			  await security.deleteOne({securityusername:securityusername})
				return "Data deleted successfully"
			}
		  }
		  else {
			return "The Username is invalid"
		  }
		})
	}	
}
module.exports = Security;
