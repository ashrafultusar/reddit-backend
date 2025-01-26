const express = require("express");
const {
  createPost,
  getPosts,
  getPostDetails,
  updatePostViews,
  updatePostVotes,
  searchPosts, 
} = require("../controllers/postController");

const router = express.Router();

router.get("/search", searchPosts);

router.post("/", createPost);
router.get("/", getPosts);
router.get("/:id", getPostDetails);

router.patch("/views", updatePostViews); // Route to update view count
router.patch("/votes", updatePostVotes); // Route to update vote count

module.exports = router;
