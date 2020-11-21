const { Pool, Client } = require('pg');

let configs;
if(process.env.NODE_ENV == 'production'){
	configs = {
		connectionString: process.env.DATABASE_URL,
		ssl: false
	}
}else{
	configs = {
		user: 'postgres',
		host: 'localhost',
		database: '', //fill-in
		password: '', //fill-in
		port: 5432,
	}
}

const client = new Client(configs);
client.connect();

const pool = new Pool(configs);

module.exports = { pool }