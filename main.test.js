const supertest = require('supertest');
const request = supertest('http://localhost:3000');
const bcrypt = require("bcryptjs");

describe('Express Route Test', function () {
	// it('should return hello world', async () => {
	// 	return request.get('/hello')
	// 		.expect(200)
	// 		.expect('Content-Type', /text/)
	// 		.then(res => {
	// 			expect(res.text).toBe('Hello BENR2423');
	// 		});
	// })

	it('User login successfully', async () => {
		return request
			.post('/login')
			.send({username: "Anya Forger", userpassword: "0123456"})
			.expect('Content-Type', /json/)
			.expect(200).then(response => {
				//expect(response.text).toEqual("Login success");
				expect(response.body).toEqual(
									expect.objectContaining({
										_id: expect.any(String),
										username: expect.any(String),
										//userpassword: expect.any(String),
									})
								);
			});
	});

	it('login failed', async () => {
		return request
			.post('/login')
			.send({username: "Kristi Adams", userpassword: "012345"})
			.expect('Content-Type', /json/)
			.expect(404).then(response => {
				//expect(response.text).toEqual("Invalid Input");
				expect(response.body).toEqual(
									expect.objectContaining({
										_id: expect.any(String),
										username: expect.any(String),
									})
								);
				});
});
	

// 	it('register', async () => {
// 		return request
// 			.post('/register')
// 			.send({username: "Donovan Desmond", userpassword: "$123456"})
// 			.expect('Content-Type', /text/)
// 			.expect(200).then(response => {
// 				expect(response.text).toEqual("Successfully, create new account");
// 	});
// });

	it('register failed', async () => {
		return request
			.post('/register')
			.send({username: "Anya Forger", userpassword: "0123456"})
			.expect('Content-Type', /text/)
			.expect(404).then(response => {
				expect(response.text).toEqual("Username exists");
			});
	});

	// it('update successfully', async () => {
	// 	return request
	// 		.patch('/update')
	// 		.send({username: "Sherri Kautzer"})
	// 		.expect(200)
	// });

	// it('delete successfully', async () => {
    // 	return request
    // 	  .delete('/delete')
    // 	  .send({username:"Mark Wunsch", userpassword: "tuvp3kjsqVRA_xG"})
    // 	  .expect('Content-Type', /text/)
    // 	  .expect(200).then(response => {
    //  			expect(response.text).toEqual("Successfully Delete");
	// 		});
	// });

  	// it('delete failed', async () => {
    // 	return request
    // 	.delete('/delete')
    //   	.send({username: 'user1', userpassword: "1010"})
    //   	.expect('Content-Type', /text/)
    //   	.expect(404).then(response => {
    //     		expect(response.text).toEqual("Delete Failed");
    // 	});
	// });
});