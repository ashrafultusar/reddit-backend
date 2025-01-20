const Post = require("../models/Post");
const { post } = require("../routes/authRoutes");

exports.createPost = async (req, res) => {
  const {
    communityName,
    title,
    existingLinkFlair,
    addLinkFlair,
    author,
    content,
  } = req.body;
  
  try {
    const post = await Post.create({
      communityName,
      title,
      existingLinkFlair,
      addLinkFlair,
      author,
      content,
    });
    res.status(201).json(post);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

exports.getPosts = async (req, res) => {
  try {
    const posts = await Post.find().populate("author", "name email");
    res.status(200).json(posts);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};


exports.getPostDetails = async (req, res) => {
  try {
    const { id } = req.params; // Get the ObjectId from the request parameters
    if (!id) {
      return res.status(400).json({ message: "Post ID is required." });
    }

    const postDetails = await Post.findById(id); // Fetch the post using the ObjectId
    if (!postDetails) {
      return res.status(404).json({ message: "Post not found." });
    }

    return res.status(200).json(postDetails); // Send the post details as the response
  } catch (error) {
    console.error(error); // Log the error for debugging
    return res.status(500).json({ message: "An error occurred.", error: error.message });
  }
};

