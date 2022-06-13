const MongoClient = require("mongodb").MongoClient;
const User = require("./user");

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
})

const express = require('express')
const app = express()
const port = 3000

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
	apis: ['./main.js'], // files containing annotations as above
};
const swaggerSpec = swaggerJsdoc(options);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use(express.json())
app.use(express.urlencoded({ extended: false }))

app.get('/', (req, res) => {
	res.send('AININ SOFIYA PUNYA SERVER')
})

app.get('/welcome', (req, res) => {
	res.send('Welcome Eveyone!')
})

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       properties:
 *         _id: 
 *           type: string
 *         username: 
 *           type: string
 *         phone: 
 *           type: string
 */

/**
 * @swagger
 * /login:
 *   post:
 *     description: User Login
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
 *     responses:
 *       200:
 *         description: Successful login
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       401:
 *         description: Invalid username or password
 */
app.post('/login', async (req, res) => {
	//console.log(req.body);
	const user = await User.login(req.body.username, req.body.userpassword);
	if(user=="The Username is invalid"||user=="The Password is invalid"){
		return res.status(404).send("Invalid Input")
	}
	///return res.status(200).send("Login success")
	return res.status(200).json({
		_id:user._id,
		username: user.username,
	});
})
app.post('/register', async (req, res) => {
	//console.log(req.body);
	const user = await User.register(req.body.username, req.body.userpassword);
	if(user=="Username exists"){
		return res.status(404).send("Username exists")
	}
	return res.status(200).send("Successfully, create new account")
	
})
// /**
//  * @swagger
//  * /visitor/{id}:
//  *   get:
//  *      description: Get visitor by id
//  *      parameters;
//  *        - in: path
//  * 			name: id
//  * 			schema:
//  * 				type: string
//  * 			required: true
//  * 			description: visitor id
//  */
//  app.get('/visitor/:id',async(req,res)=>{
// })
// app.patch('/update', async (req, res) => {
// 	console.log(req.body);
// 	const user = await User.update(req.body.username);
// 	if(user == "The Username is incorrect"){
// 		return res.status(404).send("Fail updated")
// 	}
// 	return res.status(200).send("Successfully updated")
	
// })
// app.delete ('/delete', async (req, res) => {
// 	console.log(req.body);
// 	const user = await User.delete(req.body.username,req.body.userpassword);
// 	if (user == 'The Password is invalid' || user == "The Username is invalid"){
// 	  return res.status(404).send('Delete Failed')
// 	}
// 	return res.status(200).send('Successfully Delete')
//   })
app.listen(port, () => {
	console.log(`Example app listening on port ${port}`)
})
