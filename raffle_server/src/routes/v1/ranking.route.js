const express = require('express');
const rankingController = require('../../controllers/ranking.controller');

const router = express.Router();

router
.route('/v1')
.get(rankingController.make_rank)

module.exports = router;

/**
 * @swagger
 * tags:
 *   name: Rankings
 *   description: Ranking management and retrieval
 */

