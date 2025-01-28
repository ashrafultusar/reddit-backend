const User = require("../models/User");
const bcrypt = require("bcryptjs");

exports.register = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hashedPassword });

    res.status(201).json(user);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    res.status(200).json(user); 
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

exports.users = async (req, res) => {
  try {
    const users = await User.find();
    if (!users) {
      res.status(404).json({ message: "users not found" });
    }
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ message: "server error", err });
  }
};
exports.user = async (req, res) => {
  const { email } = req.params;

  try {
    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const user = await User.findOne({ email: email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(user);
  } catch (err) {
    console.error(err); 
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
