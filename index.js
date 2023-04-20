const express = require('express');
const app = express();
require('dotenv').config();

const imageRouter = require('./src/routers/image.router');

const port = process.env.PORT || 8080;

// Init Middleware
app.use(express.json());

app.use(function (req, res, next) {
	res.header('Access-Control-Allow-Origin', '*');
	res.header('Access-Control-Allow-Methods', 'GET, PUT, PATCH, POST, DELETE');
	res.header(
		'Access-Control-Allow-Headers',
		'Origin, X-Requested-With, Content-Type, Accept, Authorization'
	);
	next();
});

//Routes
app.use('/api', imageRouter);

app.listen(port, () => {
	console.log('Server is up on port ' + port);
});
