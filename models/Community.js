const mongoose = require("mongoose");

const communitySchema = new mongoose.Schema({
  communityName: { type: String, required: true },
  creator: { type: String, required: true },
  description: { type: String },
  createdAt: { type: Date, default: Date.now },
  email: {type: String}
}); 
 
module.exports = mongoose.model("Community", communitySchema);
