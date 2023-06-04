const bcrypt = require('bcrypt');
const db = require('../database/db');

// Register a new user
const registerUser = async (req, res) => {
  try {
    const { username, password, email } = req.body;
    
    // Hash the password
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);
    
    const query = 'INSERT INTO Users (username, password_hash, email) VALUES ($1, $2, $3) RETURNING user_id';
    const values = [username, passwordHash, email];
    
    const result = await db.query(query, values);
    const newUser = {
      user_id: result.rows[0].user_id,
      username,
      email
    };
    
    res.json(newUser);
  } catch (error) {
    res.status(500).json({ error: 'Failed to register user' });
  }
};

// Login user
const loginUser = async (req, res) => {
  try {
    const { username, password } = req.body;
    
    const query = 'SELECT * FROM Users WHERE username = $1';
    const values = [username];
    
    const result = await db.query(query, values);
    
    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Invalid username or password' });
    }
    
    const user = result.rows[0];
    
    // Compare the entered password with the hashed password
    const match = await bcrypt.compare(password, user.password_hash);
    
    if (!match) {
      return res.status(401).json({ error: 'Invalid username or password' });
    }
    
    res.json({ message: 'Login successful', user_id: user.user_id });
  } catch (error) {
    res.status(500).json({ error: 'Failed to login' });
  }
};

// Get user by ID
const getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const query = 'SELECT * FROM Users WHERE user_id = $1';
    const values = [id];
    
    const result = await db.query(query, values);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    const user = result.rows[0];
    
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: 'Failed to get user' });
  }
};

// Update user by ID
const updateUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const { username, email } = req.body;
    
    const query = 'UPDATE Users SET username = $1, email = $2 WHERE user_id = $3 RETURNING *';
    const values = [username, email, id];
    
    const result = await db.query(query, values);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    const updatedUser = result.rows[0];
    
    res.json(updatedUser);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update user' });
  }
};

// Delete user by ID
const deleteUserById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const query = 'DELETE FROM Users WHERE user_id = $1 RETURNING *';
    const values = [id];
    
    const result = await db.query(query, values);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    const deletedUser = result.rows[0];
    
    res.json(deletedUser);
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete user' });
  }
};

module.exports = {
  registerUser,
  loginUser,
  getUserById,
  updateUserById,
  deleteUserById
};
