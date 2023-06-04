const express = require('express');
const router = express.Router();
const usersController = require('../controllers/usersController');

router.post('/register', usersController.registerUser);
router.post('/login', usersController.loginUser);
router.get('/:id', usersController.getUserById);
router.put('/:id', usersController.updateUserById);
router.delete('/:id', usersController.deleteUserById);

module.exports = router;
