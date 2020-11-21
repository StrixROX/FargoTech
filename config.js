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
		password: '#0xWM10X', //fill-in
		host: 'localhost',
		database: 'fargotech', //fill-in
		port: 5432,
	}
}

const client = new Client(configs);
client.connect();

const pool = new Pool(configs);

module.exports = { pool }