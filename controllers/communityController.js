const Community = require("../models/Community");
const Post = require("../models/Post");

exports.createCommunity = async (req, res) => {
  const { communityName, creator, description } = req.body;

  try {
    const community = await Community.create({
      communityName,
      creator,
      description,
    });
    res.status(201).json(community);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

exports.getCommunities = async (req, res) => {
  try {
    const communities = await Community.find({}, "communityName");
    res.status(200).json(communities);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

exports.getCommunityDetails = async (req, res) => {
  const { communityName } = req.params;

  try {
    // Find the community
    const community = await Community.findOne({ communityName });
    if (!community) {
      return res.status(404).json({ message: "Community not found" });
    }

    // Fetch posts under the community
    const posts = await Post.find({ communityName });

    // Extract unique authors (user count)
    const uniqueAuthors = new Set(posts.map((post) => post.author));

    // Build response
    const response = {
      communityName: community.communityName,
      description: community.description,
      creator: community.creator,
      createdAt: community.createdAt,
      postCount: posts.length,
      posts,
      userCount: uniqueAuthors.size,
    };

    res.status(200).json(response);
  } catch (error) {
    console.error("Error fetching community details:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// module.exports = {
//   getCommunityDetails,
// };
