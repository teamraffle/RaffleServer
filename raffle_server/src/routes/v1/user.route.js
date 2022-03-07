const express = require('express');

const router = express.Router();

router.get('/:userId', function (req, res) {
  res.send('user');
})

router.patch('/:userId', function (req, res) {
  res.send('user');
})

router.post('/:userId', function (req, res) {
  res.send('user');
})

router.get('/', function (req, res) {
  res.send('user');
})

module.exports = router;

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: User management and retrieval
 */

