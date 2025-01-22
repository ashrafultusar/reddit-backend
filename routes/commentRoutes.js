const express = require("express");
const {
  addCommentOrReply,
  getCommentsByPost,
} = require("../controllers/commentController");

const router = express.Router();

// Add a comment or reply
router.post("/", addCommentOrReply);

// Get all comments and nested replies for a specific post
router.get("/:postId", getCommentsByPost);

module.exports = router;
