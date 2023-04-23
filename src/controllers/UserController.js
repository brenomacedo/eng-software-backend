const User = require('../models/User');

class UserController {
  // Receive a request and a response.

  // Create: create a new user
  async create(req, res) {
    try {
      const { name, email } = req.body;
      const user = await User.query().insert({ name, email });
      res.json(user);
    } catch (err) {
      throw new Error('Failed to create user: ' + err.message);
    }
  }

  // Update: edit the user
  async update(req, res) {
    try {
      const { id } = req.params;
      const user = await User.query().findById(id);
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
      const { name, email } = req.body;
      user.name = name;
      user.email = email;
      await user.save();
      res.json(user);
    } catch (err) {
      throw new Error('Failed to update user:' + err.message);
    }
  }

  // Index: list all users
  async index(req, res) {
    try {
      const users = await User.query();
      res.json(users);
    } catch (err) {
      throw new Error('Failed to list users:' + err.message);
    }
  }

  // Show: show a single user by ID
  async show(req, res) {
    try {
      const { id } = req.params;
      const user = await User.query().findById(id);
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
      res.json(user);
    } catch (err) {
      throw new Error('Failed to show user:' + err.message);
    }
  }

  // Delete: delete a user by ID
  async delete(req, res) {
    try {
      const { id } = req.params;
      const user = await User.query().findById(id);
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
      await user.delete();
      res.json({ message: 'User deleted' });
    } catch (err) {
      throw new Error('Failed to delete user:' + err.message);
    }
  }
}

module.exports = UserController;
