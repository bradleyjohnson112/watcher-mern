const User = require('../models/user');
const Show = require('../models/show');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const getUser = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    // Check user exists
    if(!user) return res.status(404).send();

    const { username, email, shows, _id, } = user;

    const userDto = {
      id: _id,
      username: username,
    }

    res.status(200).json(userDto);
  } catch (err) {
    res.status(500).send();
  }
}

const createUser = async (req, res) => {
  try {
    const { username, email, password, confirm } = req.body;
    // Check all required data has been sent
    if (!username || !email || !password || !confirm) {
      return res.status(400).send("Fill empty fields");
    }

    // Check email is correct format and within char limit
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 254) {
      return res.status(400).send("Email not accepted"); 
    }
    // Check username & password are within char limit
    if(username.length > 64) return res.status(400).send("username too long");
    if(password.length < 7 || password.length > 300) {
      return res.status(400).send("ensure password is longer than 7 characters and less than 301");
    }

    // Check passwords match
    if (password!== confirm) return res.status(400).send("Passwords must match");
    
    // Check if email already exists
    if (await User.findOne({ email: email.toLowerCase() })) {
      return res.status(409).send("User with email already exists");
    }
    // Check if username already exists
    if (await User.findOne({ username: username.toLowerCase() })) {
      return res.status(409).send("Username already taken");
    }

    // Hash password
    const hashPassword = await bcrypt.hash(password, 10);
    // Create user & save to DB
    const newUser = new User({
      username: username.toLowerCase(),
      email: email.toLowerCase(),
      password: hashPassword,
    });
    await newUser.save();
    res.status(201).json({ id: newUser._id, username: newUser.username });
  } catch (err) {
    res.status(500).send();
  }                        
}

const authenticateUser = async (req, res) => {
  try {
    const { username, password } = req.body;

    // Check all required data has been sent
    if (!username || !password) {
      return res.status(400).send("Fill empty fields");
    }

    // Check username & password are within char limit
    if(username.length > 64 || password.length < 7 || password.length > 300) {
      return res.status(400).send("wrong username or password");
    }

    // Get user
    const user = await User.findOne({ username: username.toLowerCase() })

    // Check user exists
    if (!user) {
      res.status(404).send();
    }

    // Verify password
    const isMatch = await bcrypt.compare(password, user.password);
    console.log(isMatch);

    if(!isMatch) return res.status(401).send("wrong username or password");

    const payload = {
      id: user._id,
      username: user.username,
    }
    
    // Create JWT
    jwt.sign(
      payload,
      process.env.JWT_secret,
      {expiresIn: 86400},
      (err, token) => {
        if (err) throw err;

        return res.status(200).json({
          token: "Bearer " + token 
        });
      } 
    );
  } catch (err) {
    res.status(500).send();
  }
}

const deleteUser = async (req, res) => {
  try {
    // Get user
    const user = await User.findById(req.user.id);

    // Check user exists
    if (!user) {
      res.status(404).send();
    }

    console.log(user);
    console.log(user.shows.length);
    // Delete shows with user id
    if (user.shows.length > 0) {
      console.log('inside');
      await Show.deleteMany({ user: user._id });
    }
    
    // Delete user
    await user.remove();
    res.status(204).send();
  } catch (err) {
    res.status(500).send();
  }
}

module.exports = { getUser, createUser, authenticateUser, deleteUser, };