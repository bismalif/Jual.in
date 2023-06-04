const bcrypt = require('bcrypt');
const db = require('../database/db');

class User {
  constructor(id, username, passwordHash, email) {
    this.id = id;
    this.username = username;
    this.passwordHash = passwordHash;
    this.email = email;
  }

// Hashes the password
static hashPassword(password) {
    const saltRounds = 10;
    if (!password) {
      throw new Error('Password is required');
    }
    return bcrypt.hashSync(password, saltRounds);
  }
  
// Creates a new user
static async createUser(username, password, email) {
    const passwordHash = User.hashPassword(password);
    console.log(passwordHash)
    const newUser = new User(null, username, passwordHash, email);
    
    const query = 'INSERT INTO Users (username, password_hash, email) VALUES ($1, $2, $3) RETURNING user_id';
    const values = [newUser.username, newUser.passwordHash, newUser.email];
    
    try {
      const result = await db.query(query, values);
      newUser.id = result.rows[0].user_id;
      return newUser;
    } catch (error) {
      throw new Error('Failed to create user');
    }
  }
  
  
  // Validates the password
  validatePassword(password) {
    return bcrypt.compareSync(password, this.passwordHash);
  }

  // Get user by ID
  static async getUserById(id) {
    const query = 'SELECT * FROM Users WHERE user_id = $1';
    const values = [id];
    
    try {
      const result = await db.query(query, values);
      const user = result.rows[0];
      if (user) {
        return new User(user.user_id, user.username, user.password_hash, user.email);
      } else {
        return null;
      }
    } catch (error) {
      throw new Error('Failed to get user by ID');
    }
  }

  // Get user by username
  static async getUserByUsername(username) {
    const query = 'SELECT * FROM Users WHERE username = $1';
    const values = [username];
    
    try {
      const result = await db.query(query, values);
      const user = result.rows[0];
      if (user) {
        return new User(user.user_id, user.username, user.password_hash, user.email);
      } else {
        return null;
      }
    } catch (error) {
      throw new Error('Failed to get user by username');
    }
  }

  // Update user by ID
  static async updateUser(id, username, password, email) {
    const passwordHash = User.hashPassword(password);
    
    const query = 'UPDATE Users SET username = $1, password_hash = $2, email = $3 WHERE user_id = $4 RETURNING *';
    const values = [username, passwordHash, email, id];
    
    try {
      const result = await db.query(query, values);
      const user = result.rows[0];
      if (user) {
        return new User(user.user_id, user.username, user.password_hash, user.email);
      } else {
        return null;
      }
    } catch (error) {
      throw new Error('Failed to update user');
    }
  }

  // Delete user by ID
  static async deleteUser(id) {
    const query = 'DELETE FROM Users WHERE user_id = $1 RETURNING *';
    const values = [id];
    
    try {
      const result = await db.query(query, values);
      const user = result.rows[0];
      if (user) {
        return new User(user.user_id, user.username, user.password_hash, user.email);
      } else {
        return null;
      }
    } catch (error) {
      throw new Error('Failed to delete user');
    }
  }
}

module.exports = User;
