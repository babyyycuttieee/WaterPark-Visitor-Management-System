const supertest = require('supertest');
const request = supertest('http://localhost:3000');
const bcrypt = require("bcryptjs");

describe('Express Route Test', function () {
//////////////////////////////////////////////LOGIN\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\
/////----------------STAFF----------------\\\\\
	it('Staff login successfully', async () => {
		return request
			.post('/login/user')
			.send({username: "Robyn Deckow", userpassword: "y2Wok_h25xfk_Ul"})
			.expect('Content-Type', /json/)
			.expect(200).then(response => {
				expect(response.body).toEqual(
					expect.objectContaining({
						username: expect.any(String),
						//role: expect.any(String),
						token: expect.any(String)
					}));
			});
	});

	it('Staff login failed', async () => {
		return request
			.post('/login/user')
			.send({username: "Forger", userpassword: "1234"})
			.expect(404)
});
/////----------------MANAGEMENT----------------\\\\\  
it('Management login successfully', async () => {
	return request
		.post('/login/security')
		.send({managername: "Rufus Gerlach", managerpassword: "kOrLkU8mt9buM0J"})
		.expect('Content-Type', /json/)
		.expect(200).then(response => {
			expect(response.body).toEqual(
				expect.objectContaining({
					token: expect.any(String)
				}));
		});
});

it('Management login failed', async () => {
	return request
		.post('/login/security')
		.send({username: "Forger", userpassword: "kOrLkU8mt9buM0"})
		.expect(404)
});

//////////////////////////////////////////////REGISTER\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\
/////----------------STAFF----------------\\\\\
it('Staff register successfully', async () => {
		return request
			.post('/register/user')
			.send({username: "register sucesss", userpassword: "123456", name: "Lili", email:"afi1234@gmail.com", phonenumber: "60123890154", staffunit: "998670235",role: "staff"})
			.expect(200)
});

it('Staff register failed', async () => {
		return request
			.post('/register/user')
			.send({username: "user4", userpassword: "123456789", name: 'fir', email:"ray654@gmail.com", phonenumber: "60135673009",staffunit: "874320184",role: "staff"})
			.expect(404)
});
/////----------------CUSTOMER----------------\\\\\
it('Customer register successfully', async () => {
	return request
		.post('/register/visitor')
		.send({custname: "register sucess", custemail:"afi1234@gmail.com", custphonenumber: "6012-3890154",date: '2022-03-19',ticketbooking: '4', role: "customer"})
		.expect(200)
});

it('Customer register failed', async () => {
	return request
		.post('/register/visitor')
		.send({username: "user4", custemail:"ray654@gmail.com", custphonenumber: "6013-5673009",date: '2022-08-23',ticketbooking: '6', role: "customer"})
		.expect(404)
});

//////////////////////////////////////////////UPDATE\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\
/////----------------VISITOR----------------\\\\\
it('Update ticket booking successfully', async () => {
		return request
			.patch('/update/visitor/booking')
			.send({custname: "Bernadette Lueilwitz DVM", ticketbooking: "3"})
			.expect(200)
});
//////////////////////////////////////////////DELETE\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\
/////----------------STAFF----------------\\\\\
	it('Staff delete successfully', async () => {
    	return request
    	  .delete('/delete/user')
    	  .send({username:"Beatrice Baumbach", userpassword: "HzynxG_WHkkt6wQ"})
    	  .expect(200)
	});

  	it('Staff delete failed', async () => {
    	return request
    	.delete('/delete/user')
      	.send({username: 'delete failed', userpassword: "1010"})
      	.expect(404)
	});
/////----------------VISITOR----------------\\\\\
it('Visitor delete successfully', async () => {
	return request
	  .delete('/delete/visitor')
	  .send({custname:"Tabitha Reinger"})
	  .expect(200)
});
it('Visitor delete failed', async () => {
	return request
	  .delete('/delete/visitor')
	  .send({custname:"Anya"})
	  .expect(404)
});
});
//////////////////////////////////////////////VIEW\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\
/////----------------STAFF----------------\\\\\
it('view staff', async()=>{
    return request.get('/view/user/Hugh Schamberger')
    .expect(200)
  });
/////----------------VISITOR----------------\\\\\
it('view customer', async()=>{
    return request.get('/view/visitor/Juanita Farrell DVM')
    .expect(200)
  });

const jwt = require('jsonwebtoken');

function generateAccessToken(payload) {
  return jwt.sign(payload, "ainincantik", {expiresIn:'1h'});
}
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
