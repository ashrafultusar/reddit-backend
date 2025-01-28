const mongoose = require("mongoose");

const postSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  vote: { type: Number, default: 0 },
  views: { type: Number, default: 0 },
  existingLinkFlair: { type: String },
  addLinkFlair: { type: String },
  communityName: { type: String, required: true },
  author: { type: String, required: true },
  authorEmail: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  email: { type: String },
  voters: [{ userId: { type: String }, voteType: { type: String } }],
});

module.exports = mongoose.model("Post", postSchema);
