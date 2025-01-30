const express = require("express");
const {
  addCommentOrReply,
  getCommentsByPost,
  getAllComments,
  updateComment,
  getCommentById,
  deleteComment,
  updatesComment,
  deletesComment,
  getAdminCommentById,
  updateAdminComment,
  deleteAdminComments,
} = require("../controllers/commentController");

const router = express.Router();

// Add a comment or reply
router.post("/", addCommentOrReply);

// get all comments
router.get("/all", getAllComments);

// Get all comments and nested replies for a specific post
router.get("/:postId", getCommentsByPost);

// Update a comment
router.put("/:id", updateComment);

// Delete a comment
router.delete("/:id", deleteComment);

// Get comment by ID
router.get("/single/:id", getCommentById);

// admin code--------
// Get a single comment by ID
router.get("/single/:commentId", getAdminCommentById);

// Update comment by ID
router.put("/:commentId", updateAdminComment);

// Delete comment by ID
router.delete("/:commentId", deleteAdminComments);


module.exports = router;
