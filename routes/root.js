const express = require('express');
const router = express.Router();

router.get('/', (req, res) => res.render('index', {title: 'FargoTech'}));
router.get('/login', (req, res) => res.render('login', {title: 'Login - FargoTech'}));
router.get('/register', (req, res) => res.render('register', {title: 'Register - FargoTech'}));

module.exports = router;