let users;
const { faker } = require('@faker-js/faker');
const bcrypt = require("bcryptjs");
const req = require('express/lib/request');
const saltRounds = 10;
let encryptedPassword;


class User {
	static async injectDB(conn) {
		users = await conn.db("VMS").collection("users")
	}

	/**
	 * @remarks
	 * This method is not implemented yet. To register a new user, you need to call this method.
	 * 
	 * @param {*} username 
	 * @param {*} userpassword 
	 */

//register
	static async register(username,userpassword,encryptedPassword) {

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

		const user = await users.findOne({  
			$and: [{ 
			username: username,       
			userpassword: userpassword,
			}]})
			.then(async user =>{
			// TODO: Check if username exists
			if (user){
				if ( user.username == username )		
				{
					return "Username exists";
				}
			}
			else{
				// TODO: Save user to database
				await users.insertOne({					
					username : username,
					userpassword : userpassword,
					encryptedpassword : encryptedPassword
				})
				return "Successfully, create new account"
			}
		})	
		return user;	
	}

	//login
	static async login(username, userpassword) {

		const user = await users.findOne({$or: [{username : username}, {userpassword : userpassword}]})
		.then(async user =>{
			//console.log(username)
			if (user)
			{													
				if (user.username != username && user.userpassword == userpassword) {		
					return "The Username is invalid";
				}
				else if (user.username == username && user.userpassword != userpassword) 
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

	//updates
	// static async update(username) {

	// 	return users.findOne({username : username})
	// 	.then(async user =>{
	// 		//console.log(user)
	// 		if (user)
	// 		{									
	// 			return users.updateOne({username : username},{"$set":{Age: "28" }})
	// 			.then(result =>{
	// 				//console.log(result)
	// 			})
	// 		}
	// 		else
	// 		{
	// 		return "The Username is incorrect";
	// 		}
	// 	})
	// }

	// //delete
	// static async delete (username,userpassword){
	// 	return users.findOne({
	// 	  username : username
	// 	}).then(async user =>{
	
	// 	  if (user){
	// 		if (user.userpassword != userpassword){
	// 		  return "The Password is invalid"
	// 		}
	// 		else {
	// 		  await users.deleteOne({username:username})
	// 			return "Data deleted successfully"
	// 		}
	// 	  }
	// 	  else {
	// 		return "The Username is invalid"
	// 	  }
	// 	})
	//   }	
}
module.exports = User;