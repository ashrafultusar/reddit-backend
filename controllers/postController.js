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
    return res
      .status(500)
      .json({ message: "An error occurred.", error: error.message });
  }
};

// Update the view count for a post
exports.updatePostViews = async (req, res) => {
  try {
    const { postId } = req.body;

    // return console.log(postId);

    if (!postId) {
      return res
        .status(400)
        .json({ message: "Post ID is required in the request body." });
    }

    const post = await Post.findByIdAndUpdate(
      postId,
      { $inc: { views: 1 } },
      { new: true } // Return the updated document
    );

    if (!post) {
      return res.status(404).json({ message: "Post not found." });
    }

    return res.status(200).json({ message: "View count updated.", post });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "An error occurred.", error: error.message });
  }
};

// Update the vote count for a post
exports.updatePostVotes = async (req, res) => {
  try {
    const { postId, voteChange } = req.body;

    if (!postId || typeof voteChange !== "number") {
      return res
        .status(400)
        .json({
          message: "Post ID and vote change are required in the request body.",
        });
    }

    // Find the post
    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({ message: "Post not found." });
    }

    // Ensure vote does not go below 0
    const newVoteCount = post.vote + voteChange;
    if (newVoteCount < 0) {
      return res
        .status(400)
        .json({ message: "Vote count cannot be less than 0." });
    }

    // Update the vote count
    post.vote = newVoteCount;
    await post.save();

    return res.status(200).json({ message: "Vote count updated.", post });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "An error occurred.", error: error.message });
  }
};
