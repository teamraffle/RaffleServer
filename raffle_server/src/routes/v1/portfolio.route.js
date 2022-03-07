const express = require('express');

const router = express.Router();

router.get('/', function (req, res) {
  res.send('p');
})

module.exports = router;

/**
 * @swagger
 * tags:
 *   name: Portfolios
 *   description: Portfolio management and retrieval
 */

