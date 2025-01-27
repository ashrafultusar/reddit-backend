const express = require("express");
const {
  addCommentOrReply,
  getCommentsByPost,
  getAllComments,
} = require("../controllers/commentController");

const router = express.Router();

// Add a comment or reply
router.post("/", addCommentOrReply);

// get all comments
router.get("/all", getAllComments);

// Get all comments and nested replies for a specific post
router.get("/:postId", getCommentsByPost);



module.exports = router;
