let customer;

class Customer{
    static async injectDB(conn){
        customer = await conn.db("Ass").collection("customers")
    }
	//Register customer
	static async registercust(custname,custemail,custphonenumber,date,ticketboooking,role) {

		const user = await customer.findOne({  
            custname: custname       
			})
			.then(async user =>{
			// TODO: Check if username exists
			if (user){
				if ( user.custname == custname )		
				{
					return "Customer exist";
				}
			}
			else{
				// TODO: Save user to database
				await customer.insertOne({					
					custname : custname,
					custemail : custemail,
					custphonenumber : custphonenumber,
                    date : date,
                    ticketboooking : ticketboooking,
					role : role
				})
				return "Successfully, create new customer"
			}
		})	
		return user;	
	}
    //View Customer
    static async viewcustomer(custname,custphonenumber){
            //console.log(user)  
            return customer.findOne({custname : custname})
            .then(async user =>{
                if (user){
                    if (user.custname == custname)
                    {
                        return "Customer exist"
                    }
                }
                return "Customer doesn't exist"
            })
    }
    // //Update Booking
    static async updatebook(custname,ticketbooking){
        return customer.findOne({custname : custname})
        .then(async user =>{
            if (user)
            {
                return customer.updateOne({custname : custname},{"$set":{update_ticketbooking: ticketbooking}})
                .then(result =>{
                    //console.log(result)
                    return "Update success"
                })
            }
            else
            {
                return "Customer doesn't exist"
            }
        })
    }
    //Delete Customer
    static async deletecust(custname){
        return customer.findOne({custname : custname})
        .then(async user =>{
            if (user){
                if (user.custname != custname){
                  return "Customer doesn't exist"
                }
                else{
                    await customer.deleteOne({custname : custname})
                    return "Data deleted successfully"
                }
              }
            else 
            {
                return "Invalid input"
            }
        })
    }

}
module.exports = Customer;