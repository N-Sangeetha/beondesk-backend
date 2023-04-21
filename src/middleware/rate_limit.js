const rateLimit = require('express-rate-limit')

const rate_limiter = rateLimit({
  windowMs: 24 * 60 * 60 * 1000, // 24 hrs in milliseconds
  max: 100,
  message: {code: 429, message: 'You have exceeded the 100 requests in 24 hrs limit!'}, 
  standardHeaders: true,
})

module.exports = rate_limiter;
