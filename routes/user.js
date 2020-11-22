const express = require('express');
const router = express.Router();

const rf = require('./router_functions');
const { pool } = require('../config');

let login_details = {loggedin: false, details: null};

router.get('/', (req, res) => {
	if(!login_details.loggedin){
		res.redirect('/login');
	}else{
		res.redirect('/user/' + login_details.details.id);
	}
});

router.get('/update_harvest', (req, res) => res.render('update_harvest', {title: 'Update Harvset - FargoTech', type: 'form', styles: ['forms', 'update_harvest']}))

router.get('/:id', (req, res) => {
	const id = req.params.id;

	pool.query({
		text: "SELECT * FROM user_creds WHERE id='" + id + "';",
		rowMode: 'array'
	})
	.then((resp) => {
		data = resp.rows[0];
		if (typeof(data) === 'undefined'){
			data = ['','','','','',''];
		}
		return {
			loggedin: data[5],
			details: {
				id: data[0],
				name: data[1] + ' ' + data[2],
				firstname: data[1],
				lastname: data[2],
				phone: data[3]
			}
		}
	})
	.then(({loggedin, details}) => {
		if (loggedin){
			res.render('user_home', {
				title: details.name + ' - FargoTech',
				type: 'page',
				styles: ['user_page'],
				user: details
			});
			login_details = {loggedin, details};
		}else{
			res.redirect('/login');
		}
	})

});

router.get('/:id/edit', (req, res) => {
	const details = rf.get_user_details(req.params.id);

	res.render('edit_profile', {title: 'Edit Profile - FargoTech', type: 'page', user: details})
});

router.post('/logout', (req, res) => {
	pool.query("UPDATE user_creds SET loggedin='f' WHERE id='" + login_details.details.id + "';")
	.then(() => {
		res.redirect('/login');
		login_details = {loggedin: false, details: null};
	});
});

module.exports = router;