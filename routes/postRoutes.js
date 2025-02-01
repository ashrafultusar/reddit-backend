const express = require("express");
const { updatePost, deletePostWithComments, adminPostUpdate, adminPostDelete } = require("../controllers/postController");
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

router.patch("/views", updatePostViews); 
router.post("/votes/:postId", updatePostVotes); 

router.patch("/posts/:id", updatePost);

router.get("/:id", getPostDetails); 
router.patch("/:id", updatePost); 
router.delete("/:id", deletePostWithComments);

// admin side code
// Update a post
router.put('/:postId', adminPostUpdate)


// Delete a post
router.delete('/posts/:postId',adminPostDelete)



 
module.exports = router;
