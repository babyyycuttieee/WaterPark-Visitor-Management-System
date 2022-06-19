const MongoClient = require("mongodb").MongoClient;
const Customer = require("./visitor");
const { faker } = require('@faker-js/faker')

const custname = faker.name.findName();
const custemail = faker.internet.email();
const custphonenumber = faker.phone.phoneNumber('601#-#######');
const date = faker.date.between('2022-06-01','2024-06-01');
const ticketbooking = faker.random.numeric(1);


describe("Customer Information",() => {
    let client;
    beforeAll(async () => {
		client = await MongoClient.connect(
			"mongodb+srv://m001-student:m001-mongodb-basics@sandbox.tlq8x.mongodb.net/myFirstDatabase?retryWrites=true&w=majority",
			{ useNewUrlParser: true },
		);
		Customer.injectDB(client);
    })

    afterAll(async () => {
		await client.close();
	})

    //Register
    test("New customer registration", async () => {
		const res = await Customer.registercust(custname,custemail,custphonenumber,date,ticketbooking,"customer")
		expect(res).toBe("Successfully, create new customer")
	})

    //View
    test("Search customer", async () => {
        const res = await Customer.viewcustomer("Bernadette Lueilwitz DVM","6019-7499529")
                expect(res).toBe("Customer exist")

    })

    test("Customer nonexistence", async () => {
		const res = await Customer.viewcustomer("Anya","014-5763201")
		expect(res).toBe("Customer doesn't exist")
	})

    //Update
    test("Update ticket booking", async () => {
        const res = await Customer.updatebook("Hugh Schamberger",'4')
        expect(res).toBe("Update success")
    })

    // //Delete
    // test("Delete customer information",async () =>{
    //     const res = await Customer.deletecust("Tabitha Reinger")
    //     expect(res).toBe("Data deleted successfully")
    // })

    // test("Delete customer information failed",async () =>{
    //     const res = await Customer.deletecust("Anya")
    //     expect(res).toBe("Invalid input")
    // });
})