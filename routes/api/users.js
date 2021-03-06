const express = require("express");
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');
const { check, validationResult } = require("express-validator");

const User = require("../../models/User");

// register/users
router.post(
  "/",
  [
    check("name", "Name is required")
      .not()
      .isEmpty(),
    check("email", "Please include valide email").isEmail(),
    check("password", "Please enter password with min 8 charch").isLength({
      min: 8
    })
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, password } = req.body;
    try {
      // if user exists
      let user = await User.findOne({ email });

      if (user) {
       return  res.status(400).json({ errors: [{ msg: "User already exists" }] });
      }

      user = new User({
        name,
        email,
        password
      });

      // Encrypt password
const salt = await bcrypt.genSalt(10);
user.password = await bcrypt.hash(password, salt);
await user.save();

      //Return jsonwebtoken
      const payload = {
        user: {
          id: user.id

        }
      }
      jwt.sign(
        payload, 
        config.get('jwtSecret'),
      (err, token) => {
        if(err) throw err;
        res.json ({ token})
      }
      );

    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server error");
    }
  }
);

module.exports = router;
