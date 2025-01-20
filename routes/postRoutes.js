const express = require('express');
const { createPost, getPosts, getPostDetails } = require('../controllers/postController');
const router = express.Router();

router.post('/', createPost);
router.get('/', getPosts);
router.get('/:id',getPostDetails)
module.exports = router;

