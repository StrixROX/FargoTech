const express = require('express');
const express_layouts = require('express-ejs-layouts');

const app = express();
const port = process.env.PORT || 3000;

//initialising ejs
app.use(express_layouts);
app.set('view engine', 'ejs');

//routes
app.use('/', require('./routes/root'));
app.use('/user', require('./routes/user'));

app.use('/static', express.static('static'));

//404 page
app.use(function(req, res, next){
	res.status(404).sendFile('static/404.html', {root: __dirname });
});

app.listen(port, () => console.log('Listening on port ' + port));