const express = require('express');
const router = express.Router();
const { check, validationResult } = require ('express-validator/check');

// register/users
router.post('/' ,[
  check('name', 'Name is required')
  .not()
  .isEmpty(),
  check('email', 'Please include valide email').isEmail(),
  check('password', 'Please enter password with min 8 charch').isLength({min: 8}),

], (req,res)=> {
  const errors = validationResult(req);
  if(!errors.isEmpty()) {
    return res.status(400).json ({ errors: errors.array() });
  }
  console.log(req.body);
  res.send('User route');});

module.exports = router;