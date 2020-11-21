const express = require('express');
const router = express.Router();
const rf = require('./router_functions');

router.get('/', (req, res) => res.redirect('/login'));
router.get('/:id', (req, res) => {
	const details = rf.get_user_details(req.params.id);

	res.render('user_home', {title: details.name + ' - FargoTech', user: details})
});
router.get('/:id/edit', (req, res) => {
	const details = rf.get_user_details(req.params.id);

	res.render('edit_profile', {title: 'Edit Profile - FargoTech', user: details})
});

module.exports = router;