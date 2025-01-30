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

const getCommentById = async (req, res) => {
  const { id } = req.params;

  try {
    const comment = await Comment.findById(id);
    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }
    res.status(200).json(comment);
  } catch (error) {
    console.error("Error fetching comment:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Update a comment
const updateComment = async (req, res) => {
  const { id } = req.params;
  const { content } = req.body;

  try {
    const updatedComment = await Comment.findByIdAndUpdate(
      id,
      { content },
      { new: true }
    );

    if (!updatedComment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    res
      .status(200)
      .json({
        message: "Comment updated successfully",
        comment: updatedComment,
      });
  } catch (error) {
    console.error("Error updating comment:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Delete a comment
const deleteComment = async (req, res) => {
  const { id } = req.params;

  try {
    const deletedComment = await Comment.findByIdAndDelete(id);

    if (!deletedComment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    res.status(200).json({ message: "Comment deleted successfully" });
  } catch (error) {
    console.error("Error deleting comment:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// admin side code
const getAdminCommentById = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.commentId);
    if (!comment) return res.status(404).json({ message: "Comment not found" });
    res.json(comment);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

const updateAdminComment= async (req, res) => {
  try {
    const updatedComment = await Comment.findByIdAndUpdate(
      req.params.commentId,
      { content: req.body.content },
      { new: true }
    );
    if (!updatedComment) return res.status(404).json({ message: "Comment not found" });
    res.json(updatedComment);
  } catch (error) {
    res.status(500).json({ message: "Failed to update comment" });
  }
}

const deleteAdminComments=async (req, res) => {
  try {
    const deletedComment = await Comment.findByIdAndDelete(req.params.commentId);
    if (!deletedComment) return res.status(404).json({ message: "Comment not found" });
    res.json({ message: "Comment deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete comment" });
  }
}





module.exports = {
  addCommentOrReply,
  getCommentsByPost,
  getAllComments,
  updateComment,
  deleteComment,
  getCommentById,getAdminCommentById,updateAdminComment,deleteAdminComments
};
