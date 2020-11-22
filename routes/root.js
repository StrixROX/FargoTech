const express = require('express');
const router = express.Router();
const body_parser = require('body-parser');

const { pool } = require('../config');

router.get('/', (req, res) => res.render('index', {title: 'FargoTech', type: 'page', styles: ['index'], no_nav: true}));
router.get('/login', (req, res) => res.render('login', {title: 'Login - FargoTech', type: 'form', styles: ['forms']}));
router.get('/register', (req, res) => res.render('register', {title: 'Register - FargoTech', type: 'form', styles: ['forms']}));
router.get('/farmers-friend', (req, res) => res.render('farmers_friend', {title: 'Farmer\'s Friend - FargoTech', type: 'page', styles: ['farmers_friend']}));
router.get('/search', (req, res) => res.render('search_results', {title: 'Showing Search Results - FargoTech', type: 'page', styles: ['search']}));

router.post('/login', body_parser.urlencoded({extended: false}), (req, res) => {
	const {phone, pswd} = req.body;
	let errors = [];

	if (!phone || !pswd){
		errors.push({msg: 'Please fill all the fields'});
	}
	
	if (phone.length < 10 && !isNaN(phone)){
		errors.push({msg: 'Please enter a valid phone number.'});
	}

	pool.query({
		text: 'SELECT phone FROM user_creds;',
		rowMode: 'array'
	}).then((resp) => {
		data = resp.rows;

		let acc_exists = false;
		for(let row in data){
			if (data[row].includes(phone)){
				acc_exists = true;
				break;
			}
		}

		if (!acc_exists){
			errors.push({msg: 'The phone number is given is not registerd. Try creating an account.'});
		}

		if (errors.length > 0){
			res.render('login', {
				title: 'Login - FargoTech',
				type: 'form',
				styles: ['forms'],
				vals: {
					errors,
					phone,
					pswd
				}
			});
		}else{
			pool.query({
				text: "SELECT * FROM user_creds WHERE phone='" + phone + "';",
				rowMode: 'array'
			}).then((resp) => {
				data = resp.rows[0];
		
				if(pswd === data[4]){
					pool.query("UPDATE user_creds SET loggedin='t' WHERE phone='" + phone + "';")
					.then(() => res.redirect('/user/' + data[0]));
				}else{
					errors = [{msg: 'Incorrect phone no. or password. Please try again.'}];
	
					res.render('login', {
						title: 'Login - FargoTech',
						type: 'form',
						styles: ['forms'],
						vals: {
							errors,
							phone,
							pswd
						}
					});
				}
			})
		}
	})
})

router.post('/register', body_parser.urlencoded({extended: false}), (req, res) => {
	const {firstname, lastname, phone, pswd, pswd2} = req.body;
	let errors = [];

	if (!firstname || !lastname || !phone || !pswd || !pswd2){
		errors.push({msg: 'Please fill all the fields'});
	}

	if (pswd !== pswd2){
		errors.push({msg: 'Passwords do not match. Please fill in the passwords carefully.'});
	}

	if (pswd.length < 8){
		errors.push({msg: 'Password should be at least 8 characters long.'});
	}

	if (phone.length < 10 && !isNaN(phone)){
		errors.push({msg: 'Please enter a valid phone number.'});
	}

	pool.query({
		text: 'SELECT phone FROM user_creds;',
		rowMode: 'array'
	}).then((resp) => {
		rows = resp.rows;

		for(let row in rows){
			if (rows[row].includes(phone)){
				errors.push({msg: 'The phone number given is already registerd.'});
				break;
			}
		}

		if (errors.length > 0){
			res.render('register', {
				title: 'Register - FargoTech',
				type: 'form',
				styles: ['forms'],
				vals: {
					errors,
					firstname,
					lastname,
					phone,
					pswd, 
					pswd2
				}
			});
		}else{
			let create_user_success = true;
	
			function gen_user_id() {
				let chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
				let id = '';
				for (var i = 10; i > 0; i--) { 
					id += chars[Math.floor(Math.random() * chars.length)]; 
				}
				return id;
			}
	
			pool.query({
				text: "INSERT INTO user_creds VALUES($1, $2, $3, $4, $5);",
				values: [gen_user_id(), firstname, lastname, phone, pswd]
			})
			.catch((err) => {
				console.log(err);
				create_user_success = false;
			})
			.then(() => {
				if (create_user_success){
					res.redirect('login');
				}else{
					errors = [{msg: 'There was a problem. Please try again.'}];
		
					res.render('register', {
						title: 'Register - FargoTech',
						type: 'form',
						styles: ['forms'],
						vals: {
							errors,
							firstname,
							lastname,
							phone,
							pswd, 
							pswd2
						}
					});
				}
			});
		}
	})
})

module.exports = router;