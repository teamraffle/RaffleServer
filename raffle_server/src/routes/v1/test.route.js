const express = require('express');
const router = express.Router();

// const controller = require('../../controllers/nft.controller');
const { userService, nftService } = require('../../services');
const userController = require('../../controllers/user.controller');

router.get('/about', function (req, res) {
    res.send('About this wiki');
})

  



module.exports = router;