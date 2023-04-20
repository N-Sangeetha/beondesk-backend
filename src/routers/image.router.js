const express = require('express');
const auth = require('../middleware/auth');
const rate_limiter = require('../middleware/rate_limit');
const axios = require('axios')
const NodeCache = require("node-cache");

const router = new express.Router();
const cache = new NodeCache();

//images list
router.get('/images', [auth, rate_limiter], async (req, res) => {
	try {
		let page = req.query.page || 1;
		let per_page = req.query.per_page || 4;
    let searchQuery = req.query.search || 'hills';

    let images = null

    if (cache.has("images")) {
      console.log('from cache')
      images = cache.get("images")
    } else {
      console.log('from api')
      const response = await axios.get(`https://api.unsplash.com/photos?client_id=${process.env.UNSPLASH_ACCESS_KEY}&page=${page}&per_page=${per_page}${searchQuery ? `&query=${searchQuery}` : ''}`)
      images = response.data

      cache.set("images", images)
    }

    res.status(200).send({ code: 200, images: images });
	} catch (e) {
    console.log('err', e)
		res.status(500).send({ code: 500, message: e.name });
	}
});


//image download
router.get('/download', auth, async (req, res) => {
	try {

	} catch (e) {
		res.status(500).send({ code: 500, message: e.name });
	}
});


module.exports = router;