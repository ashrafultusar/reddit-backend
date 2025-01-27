const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema({
  postId: { type: mongoose.Schema.Types.ObjectId, ref: "Post", required: true }, // Associated post ID
  commenter: { type: String, required: true }, // Commenter's name or ID
  content: { type: String, required: true }, // Text of the comment
  parentComment: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Comment",
    default: null,
  }, // Parent comment for replies
  createdAt: { type: Date, default: Date.now },
  email: { type: String, required: true },
});

module.exports = mongoose.model("Comment", commentSchema);
