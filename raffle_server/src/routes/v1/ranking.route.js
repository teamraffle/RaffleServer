const express = require('express');
const validate = require('../../middlewares/validate');
const rankingController = require('../../controllers/ranking.controller');
const rankingValidation = require('../../validations/ranking.validation');
const router = express.Router();

router
.route('/v1')
.get(validate(rankingValidation.getRanking),rankingController.get_rank)

module.exports = router;

/**
 * @swagger
 * tags:
 *   name: Rankings
 *   description: Ranking management and retrieval
 */

