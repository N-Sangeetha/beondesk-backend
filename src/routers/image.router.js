const express = require("express");
const auth = require("../middleware/auth");
const rate_limiter = require("../middleware/rate_limit");
const axios = require("axios");
const NodeCache = require("node-cache");

const router = new express.Router();
const cache = new NodeCache();

//images list
router.get("/images", [auth, rate_limiter], async (req, res) => {
  try {
    let page = req.query.page || 1;
    let per_page = req.query.per_page || 4;
    let query = req.query.query || "hills";

    let images = null;

    if (cache.has("cacheImage")) {
      console.log("from cache");

      const cacheImages = cache.get("cacheImage");
      let index = cacheImages?.findIndex(
        (x) => x.page === page && x.per_page === per_page && x.query === query
      );
      if (index !== -1) {
        return res.status(200).send({ code: 200, images: cacheImages[index].images });
      }
    }

    console.log("from api");
    const response = await axios.get(
      `https://api.unsplash.com/search/photos?client_id=${
        process.env.UNSPLASH_ACCESS_KEY
      }&page=${page}&per_page=${per_page}${query ? `&query=${query}` : ""}`
    );
    images = response.data;

    let cacheImages = cache.get("cacheImage");
    cacheImages = cacheImages ? cacheImages : []
    cacheImages.push({ page, per_page, query, images })

    cache.set("cacheImage", cacheImages);

    return res.status(200).send({ code: 200, images: images });
  } catch (e) {
    console.log("Error from images api", e);
    res.status(500).send({ code: 500, message: e.name });
  }
});

//image download
router.get("/download", auth, async (req, res) => {
  try {
    const response = await axios.get(
      `https://api.unsplash.com/photos/${req.query.id}/download?client_id=${process.env.UNSPLASH_ACCESS_KEY}`
    )

    if(response.data){
      res.status(200).send(response.data?.url);
    }else{
      res.status(404).send('Not Found')
    }

  } catch (e) {
    console.log('Error in download api', e)
    res.status(500).send({ code: 500, message: e.name });
  }
});

module.exports = router;
