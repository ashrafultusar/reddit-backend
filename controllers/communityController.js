const Community = require("../models/Community");
const Post = require("../models/Post");
const Comment = require("../models/Comment");

// exports.createCommunity = async (req, res) => {
//   const { communityName, creator, description } = req.body;

//   try {
//     const community = await Community.create({
//       communityName,
//       creator,
//       description,
//     });
//     res.status(201).json(community);
//   } catch (err) {
//     res.status(500).json({ message: "Server error" });
//   }
// };

exports.createCommunity = async (req, res) => {
  const { communityName, creator, description } = req.body;

  try {
    // Check if a community with the same name already exists
    const existingCommunity = await Community.findOne({ communityName });

    if (existingCommunity) {
      return res.status(400).json({ message: "A community with this name already exists" });
    }

    // Create the community if the name is unique
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

    // Fetch comments for each post
    const postsWithComments = await Promise.all(
      posts.map(async (post) => {
        const comments = await Comment.find({ postId: post._id });
        return { ...post.toObject(), comments }; // Include comments with each post
      })
    );

    // Extract unique authors (user count)
    const uniqueAuthors = new Set(posts.map((post) => post.author));

    // Build response
    const response = {
      communityName: community.communityName,
      description: community.description,
      creator: community.creator,
      createdAt: community.createdAt,
      postCount: posts.length,
      posts: postsWithComments,
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
