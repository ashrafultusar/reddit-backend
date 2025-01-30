const express = require('express');
const { register, login, users, user, getUserByEmail } = require('../controllers/authController');
const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get("/users", users)
router.get("/user/:email", user)

// admin side code
// Endpoint to get user by email
router.get('/user/:email', getUserByEmail);


module.exports = router;
