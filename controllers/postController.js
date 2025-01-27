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
    // Find posts and populate the author field
    const posts = await Post.find().populate("author", "name email");

    // Loop through each post to find its associated comments
    const postsWithComments = await Promise.all(
      posts.map(async (post) => {
        const comments = await Comment.find({ postId: post._id });
        return { ...post.toObject(), comments }; // Merge comments into the post object
      })
    );

    res.status(200).json(postsWithComments);
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
  const { postId } = req.params;
  const { email, voteType } = req.body;

  try {
    // Find the post
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    // Find the voter
    const voter = await User.findOne({ email });
    if (!voter) {
      return res.status(404).json({ error: "Voter not found" });
    }

    // Find the author of the post
    const author = await User.findOne({ email: post.authorEmail });
    if (!author) {
      return res.status(404).json({ error: "Author not found" });
    }

    // Check if the voter has already voted on this post
    const existingVote = post.voters.find((v) => v.userId === email);
    if (existingVote) {
      // Prevent duplicate votes of the same type
      if (existingVote.voteType === voteType) {
        return res
          .status(400)
          .json({ error: "You have already voted this way." });
      }

      // Reverse the previous vote's impact on the author
      if (existingVote.voteType === "upvote") {
        post.vote -= 1;
        author.reputation -= 5;
      } else if (existingVote.voteType === "downvote") {
        post.vote += 1;
        author.reputation += 10;
      }

      // Update the voter's vote type
      existingVote.voteType = voteType;
    } else {
      // Add a new vote to the voters array
      post.voters.push({ userId: email, voteType });
    }

    // Apply the new vote's impact
    if (voteType === "upvote") {
      post.vote += 1;
      author.reputation += 5;
    } else if (voteType === "downvote") {
      post.vote -= 1;
      author.reputation -= 10;
    }

    // Save the changes
    await post.save();
    await author.save();

    res.status(200).json({ message: "Vote recorded successfully", post });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};
// exports.updatePostVotes = async (req, res) => {
//   try {
//     const { postId, voteChange } = req.body;

//     if (!postId || typeof voteChange !== "number") {
//       return res.status(400).json({
//         message: "Post ID and vote change are required in the request body.",
//       });
//     }

//     // Find the post
//     const post = await Post.findById(postId);

//     if (!post) {
//       return res.status(404).json({ message: "Post not found." });
//     }

//     // Ensure vote does not go below 0
//     const newVoteCount = post.vote + voteChange;
//     if (newVoteCount < 0) {
//       return res
//         .status(400)
//         .json({ message: "Vote count cannot be less than 0." });
//     }

//     // Update the vote count
//     post.vote = newVoteCount;
//     await post.save();

//     return res.status(200).json({ message: "Vote count updated.", post });
//   } catch (error) {
//     console.error(error);
//     return res
//       .status(500)
//       .json({ message: "An error occurred.", error: error.message });
//   }
// };

exports.searchPosts = async (req, res) => {
  const { query } = req.query;

  if (!query) {
    return res.status(400).json({ error: "Query parameter is required" });
  }

  try {
    // Search posts by title
    const postsByTitle = await Post.find({
      title: { $regex: query, $options: "i" },
    });

    // Search posts by comments' content
    const comments = await Comment.find({
      content: { $regex: query, $options: "i" },
    });
    const postIdsFromComments = comments.map((comment) => comment.postId);

    // Combine and remove duplicate post IDs
    const uniquePostIds = [
      ...new Set([
        ...postsByTitle.map((post) => post._id),
        ...postIdsFromComments.filter((id) =>
          mongoose.Types.ObjectId.isValid(id)
        ), // Filter valid ObjectIds
      ]),
    ];

    // Fetch full post details
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

// Update Post
exports.updatePost = async (req, res) => {
  try {
    const { id } = req.params; // Get post ID from params
    const updatedData = req.body; // Get updated data from request body

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
