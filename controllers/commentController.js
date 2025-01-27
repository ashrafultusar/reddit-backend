const Comment = require("../models/Comment");
const Post = require("../models/Post");

// Add a comment or reply
const addCommentOrReply = async (req, res) => {
  const { postId, content, commenter, parentComment, email } = req.body;

  try {
    // Ensure the post exists
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    // Create and save the comment
    const newComment = new Comment({
      postId,
      content,
      commenter,
      parentComment: parentComment || null,
      email,
    });

    const savedComment = await newComment.save();
    res
      .status(201)
      .json({ message: "Comment added successfully", comment: savedComment });
  } catch (error) {
    console.error("Error adding comment:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Get comments with nested replies for a specific post
const getCommentsByPost = async (req, res) => {
  const { postId } = req.params;

  try {
    // Ensure the post exists
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    // Fetch top-level comments
    const comments = await Comment.find({ postId, parentComment: null }).sort({
      createdAt: -1,
    });

    // Calculate total comments count for the post
    const totalCommentCount = await Comment.countDocuments({ postId });

    // Function to fetch replies recursively
    const populateReplies = async (comment) => {
      const replies = await Comment.find({ parentComment: comment._id }).sort({
        createdAt: -1,
      });
      return Promise.all(
        replies.map(async (reply) => ({
          ...reply.toObject(),
          replies: await populateReplies(reply), // Recursively fetch nested replies
        }))
      );
    };

    // Populate replies for all top-level comments
    const commentsWithReplies = await Promise.all(
      comments.map(async (comment) => ({
        ...comment.toObject(),
        replies: await populateReplies(comment),
      }))
    );

    res.status(200).json({
      totalCommentCount,
      comments: commentsWithReplies,
    });
  } catch (error) {
    console.error("Error fetching comments:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const getAllComments = async (req, res) => {
  try {
    // Fetch all comments with optional population for related fields
    const comments = await Comment.find()
      .populate("postId", "title") // Populate related post (e.g., title)
      .populate("parentComment", "content") // Populate parent comment (e.g., content)
      .exec();

    res.status(200).json(comments);
  } catch (err) {
    console.error("Error fetching comments:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = { addCommentOrReply, getCommentsByPost, getAllComments };
