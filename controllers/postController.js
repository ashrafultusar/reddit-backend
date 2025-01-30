const mongoose = require("mongoose");
const Post = require("../models/Post");
const { post } = require("../routes/authRoutes");

const Comment = require("../models/Comment");
const User = require("../models/User");

exports.createPost = async (req, res) => {
  const {
    communityName,
    title,
    existingLinkFlair,
    addLinkFlair,
    author,
    content,
    email,
    authorEmail,
  } = req.body;

  try {
    const post = await Post.create({
      communityName,
      title,
      existingLinkFlair,
      addLinkFlair,
      author,
      content,
      email,
      authorEmail,
    });
    res.status(201).json(post);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

exports.getPosts = async (req, res) => {
  try {
    
    const posts = await Post.find().populate("author", "name email");

    const postsWithComments = await Promise.all(
      posts.map(async (post) => {
        const comments = await Comment.find({ postId: post._id });
        return { ...post.toObject(), comments }; 
      })
    );

    res.status(200).json(postsWithComments);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

exports.getPostDetails = async (req, res) => {
  try {
    const { id } = req.params; 
    if (!id) {
      return res.status(400).json({ message: "Post ID is required." });
    }

    const postDetails = await Post.findById(id); 
    if (!postDetails) {
      return res.status(404).json({ message: "Post not found." });
    }

    return res.status(200).json(postDetails); 
  } catch (error) {
    console.error(error); 
    return res
      .status(500)
      .json({ message: "An error occurred.", error: error.message });
  }
};

// Update the view count for a post
exports.updatePostViews = async (req, res) => {
  try {
    const { postId } = req.body;

    if (!postId) {
      return res
        .status(400)
        .json({ message: "Post ID is required in the request body." });
    }

    const post = await Post.findByIdAndUpdate(
      postId,
      { $inc: { views: 1 } },
      { new: true } 
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
  const { postId } = req.params;
  const { email, voteType } = req.body;

  try {
   
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    
    const voter = await User.findOne({ email });
    if (!voter) {
      return res.status(404).json({ error: "Voter not found" });
    }

    const author = await User.findOne({ email: post.authorEmail });
    if (!author) {
      return res.status(404).json({ error: "Author not found" });
    }

    const existingVote = post.voters.find((v) => v.userId === email);
    if (existingVote) {
      
      if (existingVote.voteType === voteType) {
        return res
          .status(400)
          .json({ error: "You have already voted this way." });
      }

   
      if (existingVote.voteType === "upvote") {
        post.vote -= 1;
        author.reputation -= 5;
      } else if (existingVote.voteType === "downvote") {
        post.vote += 1;
        author.reputation += 10;
      }

    
      existingVote.voteType = voteType;
    } else {
     
      post.voters.push({ userId: email, voteType });
    }

  
    if (voteType === "upvote") {
      post.vote += 1;
      author.reputation += 5;
    } else if (voteType === "downvote") {
      post.vote -= 1;
      author.reputation -= 10;
    }

   
    await post.save();
    await author.save();

    res.status(200).json({ message: "Vote recorded successfully", post });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};


exports.searchPosts = async (req, res) => {
  const { query } = req.query;

  if (!query) {
    return res.status(400).json({ error: "Query parameter is required" });
  }

  try {
   
    const postsByTitle = await Post.find({
      title: { $regex: query, $options: "i" },
    });

   
    const comments = await Comment.find({
      content: { $regex: query, $options: "i" },
    });
    const postIdsFromComments = comments.map((comment) => comment.postId);

   
    const uniquePostIds = [
      ...new Set([
        ...postsByTitle.map((post) => post._id),
        ...postIdsFromComments.filter((id) =>
          mongoose.Types.ObjectId.isValid(id)
        ), 
      ]),
    ];

    const posts = await Post.find({ _id: { $in: uniquePostIds } });

    res.json(posts);
  } catch (error) {
    console.error("Error searching posts:", error.message);
    res
      .status(500)
      .json({ message: "An error occurred.", error: error.message });
  }
};

// Get Post Details by ID
exports.getPostDetails = async (req, res) => {
  try {
    const { id } = req.params; // Get post ID from params
    if (!id) {
      return res.status(400).json({ message: "Post ID is required." });
    }

    const postDetails = await Post.findById(id);
    if (!postDetails) {
      return res.status(404).json({ message: "Post not found." });
    }

    res.status(200).json(postDetails);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error.", error: error.message });
  }
};


exports.updatePost = async (req, res) => {
  try {
    const { id } = req.params; 
    const updatedData = req.body; 

    if (!id) {
      return res.status(400).json({ message: "Post ID is required." });
    }

    const updatedPost = await Post.findByIdAndUpdate(id, updatedData, {
      new: true,
    });

    if (!updatedPost) {
      return res.status(404).json({ message: "Post not found." });
    }

    res
      .status(200)
      .json({ message: "Post updated successfully!", updatedPost });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error.", error: error.message });
  }
};

exports.deletePostWithComments = async (req, res) => {
  const { id } = req.params;

  try {
    // Delete the post
    const post = await Post.findByIdAndDelete(id);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    // Delete all comments associated with the post
    await Comment.deleteMany({ postId: id });

    res.json({ message: "Post and its comments deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting post", error });
  }
};

// admin side code

