const express = require('express');
const auth = require('../middleware/auth');
const rate_limiter = require('../middleware/rate_limit');
const axios = require('axios')
const router = new express.Router();

function memoize(method) {
  const cache = [];
  
  return async function() {
      let index = cache.findIndex(x => (x.page === arguments['0'] && x.per_page === arguments['1'] && x.query === arguments['2']))

      console.log('cache', cache)
      if(index !== -1) {
        console.log('from cache')
        return cache[index].images
      }

      const images = await method.apply(this, arguments);
      const data = {
        page: arguments['0'],
        per_page: arguments['1'],
        query: arguments['2'],
        images: images
      }
      cache.push(data)
      console.log('from api')
      return images;
  };
}

//images list
router.get('/images', [auth, rate_limiter], async (req, res) => {
	try {
		let page = req.query.page || 1;
		let per_page = req.query.per_page || 4;
    let searchQuery = req.query.query || 'hills';

    const memoizedData =  memoize(async function() {
      const response = await axios.get(`https://api.unsplash.com/search/photos?client_id=${process.env.UNSPLASH_ACCESS_KEY}&page=${page}&per_page=${per_page}${searchQuery ? `&query=${searchQuery}` : ''}`);

      return response.data
  });

  const images = await memoizedData(page, per_page, searchQuery)

    res.status(200).send({ code: 200, images: images });
	} catch (e) {
    console.log('Error in get images', e)
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