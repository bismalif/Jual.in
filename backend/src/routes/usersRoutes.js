const express = require('express');
const router = express.Router();
const usersController = require('../controllers/usersController');

// Register a new user
router.post('/register', usersController.registerUser);

// Login user
router.post('/login', usersController.loginUser);

// Get user by ID
router.get('/:id', usersController.getUserById);

// Update user by ID
router.put('/:id', usersController.updateUserById);

// Delete user by ID
router.delete('/:id', usersController.deleteUserById);

module.exports = router;
