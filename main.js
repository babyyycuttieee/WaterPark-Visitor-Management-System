const MongoClient = require("mongodb").MongoClient;

const User = require("./user")
const Management = require("./security");
const Customer = require("./visitor");

MongoClient.connect(
	// TODO: Connection 
	"mongodb+srv://m001-student:m001-mongodb-basics@sandbox.tlq8x.mongodb.net/myFirstDatabase?retryWrites=true&w=majority",
	{ useNewUrlParser: true },
).catch(err => {
	console.error(err.stack)
	process.exit(1)
}).then(async client => {
	console.log('Connected to MongoDB');
	User.injectDB(client);
	Management.injectDB(client);
	Customer.injectDB(client);
})

const express = require('express');
const { userInfo } = require("os");
const app = express()
const port = process.env.PORT || 3000

const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');
const options = {
	definition: {
		openapi: '3.0.0',
		info: {
			title: 'MyVMS API',
			version: '1.0.0',
		},
	},
	apis: ['./main.js'],
}
const swaggerSpec = swaggerJsdoc(options);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use(express.json())
app.use(express.urlencoded({ extended: false }))

//////////////////////////////////////////////LOGIN\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\
// login staff
app.post('/login/user', async (req, res) => {
	console.log(req.body);
	const user = await User.login(req.body.username, req.body.userpassword, req.body.role);
	if (user == "The Username is invalid" || user == "The Password is invalid") {
		return res.status(404).send("Invalid Input")
	}
	else {
		return res.status(200).json({
			username: user.username,
			//role: user.role,
			token: generateAccessToken({
				role: user.role
			}),
		});
	}
})

/**
 * @swagger
 * /login/user:
 *   post:
 *     description: Staff Login
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: 
 *             type: object
 *             properties:
 *               username: 
 *                 type: string
 *               userpassword:
 *                 type: string
 *               role: 
 *                 type: string
 *     responses:
 *       200:
 *         description: Successful login
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/LoginUser'
 * 
 *       404:
 *         description: Invalid Input
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     LoginUser:
 *       type: object
 *       properties:
 *         username: 
 *           type: string
 *         role:
 *           type: string
 *         token:
 *           type: string
 *          
 */

//management login
app.post('/login/security', async (req, res) => {
	console.log(req.body)
	const management = await Management.login(req.body.managername, req.body.managerpassword, req.body.role);
	if (management == "The Username is invalid" || management == "The Password is invalid") {
		return res.status(404).send("Invalid Input")
	}
	else {
		return res.status(200).json({
			managername: management.managername,
			//role: management.role,
			token: generateAccessToken({
				role: management.role
			}),
		});
	}
})

 /**
 * @swagger
 * /login/security:
 *   post:
 *     description: Management login
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: 
 *             type: object
 *             properties:
 *               managername: 
 *                 type: string
 *               managerpassword:
 *                 type: string
 *               role: 
 *                 type: string
 *     responses:
 *       200:
 *         description: Successful login
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/LoginSecurity'
 * 
 *       404:
 *         description: Invalid Input
 */

 /**
 * @swagger
 * components:
 *   schemas:
 *     LoginSecurity:
 *       type: object
 *       properties:
 *         username: 
 *           type: string
 *         role:
 *           type: string
 *         token:
 *           type: string
 *          
 */

//////////////////////////////////////////////VIEW\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\
//View Visitor
app.get('/view/visitor/:name', async (req, res) => {
	console.log(req.body)
	const view = await Customer.viewcustomer(req.body.custname)
	if (view == "Customer doesn't exist") {
		return res.status(404).send("Customer not exist")
	}
	return res.status(200).json({
		Name: view.custname,
		Date: view.date,
		Ticket_booking: view.ticketbooking,
	})
})
 /**
 * @swagger
 * /view/visitor/{name}:
 *   get:
 *     description: View Visitor
 *     parameters:
 *       - in: path
 *         custname: custname
 *         required: true
 *         schema: 
 *             type: string
 *     responses:
 *       200:
 *         description: Customer exist
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ViewVisitor'
 * 
 *       404:
 *         description: Customer doesn't exist
 */

  /**
 * @swagger
 * components:
 *   schemas:
 *     ViewVisitor:
 *       type: object
 *       properties:
 *         custname: 
 *           type: string
 *         date:
 *           type: string
 *         ticket booking:
 *           type: string
 *          
 */
//////////////////////////////////////////////AUTHORIZATION\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\
//only authorized person can access
app.use((req, res, next) => {
	const authHeader = req.headers['authorization']
	const token = authHeader && authHeader.split(' ')[1]

	jwt.verify(token, "ainincantik", (err, user) => {
		console.log(err)

		if (err) return res.sendStatus(403)

		req.user = user

		next()
	})
});

/////----------------MANAGEMENT----------------\\\\\
//Register Staff
app.post('/register/user', async (req, res) => {
	console.log(req.body);
	const registerst = await User.register(req.body.username, req.body.userpassword, req.body.name, req.body.email, req.body.phonenumber, req.body.staffunit, req.body.role);
	if (req.user.role == 'management') {
		if (registerst == "Username exists") {
			return res.status(404).send("Username exists")
		}
		else {
			return res.status(200).send("Successfully, create new staff's account")
		}
	}
	return res.status(401).send("Unauthorized")
})

 /**
 * @swagger
 * /register/user:
 *   post:
 *     security:
 *       - bearerAuth: []
 *     description: Register Staff
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: 
 *             type: object
 *             properties:
 *               username: 
 *                 type: string
 *               staffunit:
 *                 type: string
 *     responses:
 *       200:
 *         description: Successfully, create new staff's account
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/registerU'
 * 
 *       404:
 *         description: Username exist
 */

 /**
 * @swagger
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 *   schemas:
 *     registerU:
 *       type: object
 *       properties:
 *         username: 
 *           type: string
 *         staffunit: 
 *           type: string
 *          
 */

//View Staff
app.get('/view/user/:username', async (req, res) => {
	console.log(req.body)
	const view = await User.view(req.body.username)
	if (req.user.role == "management") {
		if (view == "Unkown username") {
			return res.status(404).send("The Username is invalid")
		}
		return res.status(200).json({
			username: view.username,
			staffunit: view.staffunit
		})
	}
	else {
		return res.status(401).send('Unauthorized')
	}
})
 /**
 * @swagger
 * /view/user/{username}:
 *   get:
 *     description: View Staff
 *     parameters:
 *       - in: path
 *         username: username
 *         required: true
 *         schema: 
 *             type: string
 *     responses:
 *       200:
 *         description: Username view
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ViewUser'
 * 
 *       404:
 *         description: Unkown username
 */
  /**
 * @swagger
 * components:
 *   schemas:
 *     ViewUser:
 *       type: object
 *       properties:
 *         username: 
 *           type: string
 *         staffunit:
 *           type: string
 *          
 */
//Delete Staff
app.delete('/delete/user', async (req, res) => {
	console.log(req.body);
	const delet = await User.delete(req.body.username,req.body.userpassword);
	if (req.user.role == "management") {
		if (delet == "Invalid input") {
			return res.status(404).send("Invalid input")
		}
		else {
			return res.status(200).json({ status: "Data deleted successfully" })
		}
	}
	return res.status(401).send("Unauthorized")
})
 /**
 * @swagger
 * /delete/user:
 *   delete:
 *     security:
 *       - bearerAuth: []
 *     description: Delete Staff
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: 
 *             type: object
 *             properties:
 *               username: 
 *                 type: string
 *     responses:
 *       200:
 *         description: Data deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/DeleteUser'
 * 
 *       404:
 *         description: Invalid input
 */

 /**
 * @swagger
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 *   schemas:
 *     DeleteUser:
 *       type: object
 *       properties:
 *         username: 
 *           type: string
 *          
 */


/////----------------STAFF----------------\\\\\
//Register Customer
app.post('/register/visitor', async (req, res) => { //date,ticketboooking,role
	console.log(req.body);
	const rgstcust = await Customer.registercust(req.body.custname, req.body.custemail, req.body.custphonenumber, req.body.date, req.body.ticketbooking, req.body.role);
	if (req.user.role == "staff") {
		if (rgstcust == "Customer exist") {
			return res.status(404).send("Customer exist")
		}
		else {
			return res.status(200).send("Successfully, create new customer")
		}
	}
	return res.status(401).send("Unauthorized")
})

 /**
 * @swagger
 * /register/visitor:
 *   post:
 *     security:
 *       - bearerAuth: []
 *     description: Register Visitor
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: 
 *             type: object
 *             properties:
 *               custname: 
 *                 type: string
 *               custemail:
 *                 type: string
 *               custphonenumber:
 *                 type: string
 *               date:
 *                 type: string
 *               ticketboooking:
 *                 type: string
 *     responses:
 *       200:
 *         description: Successfully, create new customer
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/RegVisitor'
 * 
 *       404:
 *         description: Customer exist
 */

 /**
 * @swagger
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 *   schemas:
 *     RegVisitor:
 *       type: object
 *       properties:
 *         custname: 
 *           type: string
 *         custemail: 
 *           type: string
 *         custphonenumber:
 *           type: string
 *         date:
 *           type: string
 *         ticketboooking:
 *           type: string
 *          
 */

//Delete Customer
app.delete('/delete/visitor', async (req, res) => {
	console.log(req.body);
	const dltcust = await Customer.deletecust(req.body.custname);
	if (req.user.role == "staff") {
		if (dltcust == "Invalid input") {
			return res.status(404).send("Customer doesn't exist")
		}
		else {
			return res.status(200).json("Data deleted successfully")
		}
	}
	return res.status(401).send("Unauthorized")
})
 /**
 * @swagger
 * /delete/visitor:
 *   delete:
 *     security:
 *       - bearerAuth: []
 *     description: Delete Customer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: 
 *             type: object
 *             properties:
 *               custname: 
 *                 type: string
 *     responses:
 *       200:
 *         description: Data deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/DCustomer'
 * 
 *       404:
 *         description: Invalid input
 */
 
 /**
 * @swagger
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 *   schemas:
 *     DCustomer:
 *       type: object
 *       properties:
 *         custname: 
 *           type: string
 *          
 */


//Update Booking
app.patch('/update/visitor/booking', async (req, res) => {
	console.log(req.body)
	const uptadecu = await Customer.updatebook(req.body.custname, req.body.ticketbooking)
	if (req.user.role == "staff") {
		if (uptadecu == "Customer doesn't exist") {
			return res.status(404).send("Customer doesn't exist")
		}
		else {
			return res.status(200).json({
				name: uptadecu.custname,
				Ticket_booking: "Update success"
			})
		}
	}
	else {
		return res.status(401).send('Unauthorized')
	}
})
 /**
 * @swagger
 * /update/visitor/booking:
 *   patch:
 *     security:
 *       - bearerAuth: []
 *     description: Update ticketbooking
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: 
 *             type: object
 *             properties:
 *               custname: 
 *                 type: string
 *               ticketbooking:
 *                 type: string
 *     responses:
 *       200:
 *         description: Update success
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Uticketbooking'
 * 
 *       404:
 *         description: Customer doesn't exist
 */
 
 /**
 * @swagger
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 *   schemas:
 *     Uticketbooking:
 *       type: object
 *       properties:
 *         custname: 
 *           type: string
 *         ticketbooking: 
 *           type: string
 *          
 */


app.listen(port, () => {
	console.log(`Example app listening on port ${port}`)
})
const jwt = require('jsonwebtoken');
function generateAccessToken(payload) {
	return jwt.sign(payload, "ainincantik", { expiresIn: '1h' });
}
