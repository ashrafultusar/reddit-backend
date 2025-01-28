const express = require("express");
const {
  addCommentOrReply,
  getCommentsByPost,
  getAllComments,
  updateComment,
  getCommentById,
  deleteComment,
 
 
} = require("../controllers/commentController");

const router = express.Router();



// Add a comment or reply
router.post("/", addCommentOrReply);

// get all comments
router.get("/all", getAllComments);

// Get all comments and nested replies for a specific post
router.get("/:postId", getCommentsByPost);

// update here



// Update a comment
router.put("/:id", updateComment);

// Delete a comment
router.delete("/:id", deleteComment);

// Get comment by ID
router.get("/single/:id", getCommentById); 


module.exports = router;
