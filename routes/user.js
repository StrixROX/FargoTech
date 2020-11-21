const express = require('express');
const router = express.Router();

const rf = require('./router_functions');
const { pool } = require('../config');

router.get('/', (req, res) => res.redirect('/login'));

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
			res.render('user_home', {title: details.name + ' - FargoTech', type: 'page', user: details});
		}else{
			res.redirect('/login');
		}
	})

});

router.get('/:id/edit', (req, res) => {
	const details = rf.get_user_details(req.params.id);

	res.render('edit_profile', {title: 'Edit Profile - FargoTech', type: 'page', user: details})
});

router.post('/:id/logout', (req, res) => {
	pool.query("UPDATE user_creds SET loggedin='f' WHERE id='" + req.params.id + "';")
	.then(() => res.redirect('/login'));
});

module.exports = router;