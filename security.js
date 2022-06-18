let management;

class Management{
    static async injectDB(conn){
        management = await conn.db("Ass").collection("management")
    }

    //login manager
	static async login(managername, managerpassword) {

		const user = await management.findOne({$or: [{managername : managername}, {managerpassword : managerpassword}]})
		.then(async user =>{
			//console.log(username)
			if (user)
			{													
				if (user.managername != managername && user.managerpassword == managerpassword) {		
					return "The Username is invalid";
				}
				else if (user.managername == managername && user.managerpassword != managerpassword) 
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
}
module.exports = Management;
