const express = require("express");
const { updatePost } = require("../controllers/postController");
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

router.patch("/posts/:id", updatePost);

router.get("/:id", getPostDetails); // Route to get post details by ID
router.patch("/:id", updatePost); // Route to update a post by ID

module.exports = router;
