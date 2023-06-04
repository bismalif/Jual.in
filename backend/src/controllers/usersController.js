const User = require('../models/users');

// Register a new user
const registerUser = async (req, res) => {
  try {
    const { username, password, email } = req.body;
    console.log(username, passwordHash, email)
    const newUser = await User.createUser(username, password, email);
    
    res.status(201).json({ user: newUser });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Login a user
const loginUser = async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.getUserByUsername(username);
    if (user && user.validatePassword(password)) {
      res.json({ message: 'Login successful', user });
    } else {
      res.status(401).json({ message: 'Invalid credentials' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get user by ID
const getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.getUserById(id);
    if (user) {
      res.json({ user });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update user by ID
const updateUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const { username, password, email } = req.body;
    const updatedUser = await User.updateUser(id, username, password, email);
    if (updatedUser) {
      res.json({ message: 'User updated successfully', user: updatedUser });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete user by ID
const deleteUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedUser = await User.deleteUser(id);
    if (deletedUser) {
      res.json({ message: 'User deleted successfully' });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  registerUser,
  loginUser,
  getUserById,
  updateUserById,
  deleteUserById,
};
