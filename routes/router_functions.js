//const { pool } = require('../config'); //later

function get_user_details(uid){
	details = {
		id: uid,
		name: 'myName',
	}

	return details
}

module.exports = {
	'get_user_details': get_user_details
}