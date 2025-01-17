const express = require('express');
const { register, login, users } = require('../controllers/authController');
const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get("/users", users)

module.exports = router;
