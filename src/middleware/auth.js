const jwt = require('jsonwebtoken');

const auth = async (req, res, next) => {
	try {
		const token = req.header('Authorization')?.replace('Bearer ', '') || '';
		const client_token_decoded = jwt.verify(token, process.env.JWT_SECRET);
		const server_token_decoded = jwt.verify(process.env.JWT_TOKEN, process.env.JWT_SECRET);
		if (client_token_decoded.name !== server_token_decoded.name) {
			throw new Error();
		}

		next();
	} catch (e) {
		console.log('Error in auth', e)
		res.send({code: 500, message: "Authentication Failed"})
	}
};

module.exports = auth;
