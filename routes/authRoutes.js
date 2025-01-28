const express = require('express');
const { register, login, users, user } = require('../controllers/authController');
const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get("/users", users)
router.get("/user/:email", user)

module.exports = router;
