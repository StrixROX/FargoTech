CREATE TABLE user_creds (
    id VARCHAR(36) PRIMARY KEY,
    firstname VARCHAR(40) NOT NULL,
    lastname VARCHAR(40) NOT NULL,
	phone VARCHAR(10) NOT NULL,
	pswd VARCHAR(60) NOT NULL,
    loggedin BOOLEAN DEFAULT FALSE
);