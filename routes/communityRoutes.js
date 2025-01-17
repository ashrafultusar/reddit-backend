const express = require('express');
const { createCommunity, getCommunities } = require('../controllers/communityController');
const router = express.Router();

router.post('/', createCommunity);
router.get('/', getCommunities);

module.exports = router;
