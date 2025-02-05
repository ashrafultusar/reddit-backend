const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema({
  postId: { type: mongoose.Schema.Types.ObjectId, ref: "Post", required: true }, 
  commenter: { type: String, required: true }, 
  content: { type: String, required: true },
  parentComment: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Comment",
    default: null,
  },
  createdAt: { type: Date, default: Date.now },
  email: { type: String, required: true },
});
 
module.exports = mongoose.model("Comment", commentSchema);
