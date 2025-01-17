const Post = require('../models/Post');

exports.createPost = async (req, res) => {
    const { title, content, author } = req.body;

    try {
        const post = await Post.create({ title, content, author });
        res.status(201).json(post);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
};

exports.getPosts = async (req, res) => {
    try {
        const posts = await Post.find().populate('author', 'name email');
        res.status(200).json(posts);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
};
