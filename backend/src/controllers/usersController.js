const bcrypt = require('bcrypt');
const db = require('../database/db');

const saltRounds = 10;

// Helper function to hash the password
const hashPassword = async (password) => {
  try {
    const salt = await bcrypt.genSalt(saltRounds);
    const hashedPassword = await bcrypt.hash(password, salt);
    return hashedPassword;
  } catch (error) {
    throw new Error('Failed to hash password');
  }
};

// Register a new user or admin
const registerUser = async (req, res) => {
  const { username, password, email, role } = req.body;

  try {
    const hashedPassword = await hashPassword(password);
    const query = 'INSERT INTO Users (username, password_hash, email, role) VALUES ($1, $2, $3, $4) RETURNING user_id';
    const values = [username, hashedPassword, email, role];
    const result = await db.pool.query(query, values);

    const newUser = {
      user_id: result.rows[0].user_id,
      username,
      email,
      role
    };

    res.status(201).json(newUser);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Failed to register user' });
  }
};

// Login user or admin
const loginUser = async (req, res) => {
  const { username, password, role } = req.body;

  try {
    const query = 'SELECT * FROM Users WHERE username = $1 AND role = $2';
    const result = await db.query(query, [username, role]);

    if (result.rows.length === 0) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    const user = result.rows[0];
    const passwordMatch = await bcrypt.compare(password, user.password_hash);

    if (!passwordMatch) {
      res.status(401).json({ error: 'Invalid password' });
      return;
    }

    res.status(200).json({ message: 'Login successful' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to login' });
  }
};

// Get user by ID
const getUserById = async (req, res) => {
  const { id } = req.params;

  try {
    const query = 'SELECT * FROM Users WHERE user_id = $1';
    const result = await db.query(query, [id]);

    if (result.rows.length === 0) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    const user = result.rows[0];
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve user' });
  }
};

// Update user by ID
const updateUserById = async (req, res) => {
  const { id } = req.params;
  const { username, email } = req.body;

  try {
    const query = 'UPDATE Users SET username = $1, email = $2 WHERE user_id = $3';
    const values = [username, email, id];
    await db.query(query, values);

    res.status(200).json({ message: 'User updated successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update user' });
  }
};

// Delete user by ID
const deleteUserById = async (req, res) => {
  const { id } = req.params;

  try {
    const query = 'DELETE FROM Users WHERE user_id = $1';
    await db.query(query, [id]);

    res.status(200).json({ message: 'User deleted successfully' });
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
