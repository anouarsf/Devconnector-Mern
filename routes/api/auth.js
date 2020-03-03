const express = require("express");
const router = express.Router();
const auth = require("../../middleware/auth");
const User = require('../../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');
const { check, validationResult } = require("express-validator");


// Get api/auth
router.get("/", auth, async(req, res) => {
try {
const user = await User.findById(req.user.id).select('-password');
res.json(user);
} catch(err) {
console.error(err.message);
res.status(500).send('Server error');
}

});

// POST/api/auth
// Authentiticate user & get token
router.post(
  "/",
  [
   
    check("email", "Please include valide email").isEmail(),
    check("password", "Password is required").exists()
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;
    try {
      // if user exists
      let user = await User.findOne({ email });

      if (!user) {
       return  res.status(400).json({ errors: [{ msg: "user not exisits" }] });
      }


const isMatch = await bcrypt.compare(password, user.password);

if(!isMatch)  {
  return  res.status(400).json({ errors: [{ msg: "password is incorrect" }] });
 }

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
