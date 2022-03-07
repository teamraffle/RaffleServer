const express = require('express');

const router = express.Router();

router.get('/', function (req, res) {
  res.send('r');
})

module.exports = router;

/**
 * @swagger
 * tags:
 *   name: Rankings
 *   description: Ranking management and retrieval
 */

