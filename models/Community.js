const mongoose = require('mongoose');

const communitySchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String },
    members: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
}, { timestamps: true });

const Community = mongoose.model('Community', communitySchema);
module.exports = Community;
