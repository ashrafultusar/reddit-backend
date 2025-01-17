const Community = require('../models/Community');

exports.createCommunity = async (req, res) => {
    const { name, description } = req.body;

    try {
        const community = await Community.create({ name, description });
        res.status(201).json(community);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
};

exports.getCommunities = async (req, res) => {
    try {
        const communities = await Community.find();
        res.status(200).json(communities);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
};
