const mongoose = require("mongoose");

const communitySchema = new mongoose.Schema({
  communityName: { type: String, required: true },
  creator: { type: String, required: true },
  description: { type: String },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Community", communitySchema);
