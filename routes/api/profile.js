const express = require("express");
const router = express.Router();
const auth = require('../../middleware/auth');
const { check, validationResult } = require('express-validator');
const Profile = require('../../models/Profile');
const User = require('../../models/User');

//route Get api/profile/me

router.get("/me", auth, async (req, res) => {
try{
const profile = await Profile.findOne({ user: req.user.id }).populate('user', 'name');
if(!profile) {
  return res.status(400).json({ msg: 'There is no profile for this user'});
}

res.json(profile);

} catch(err) {
  console.error(err.message);
  res.status(500).send('Server error')
}

});

//route POSTE api/profile
// CREATE OR UPDATE
router.post('/', [auth, [
  check('status', 'Status is required').not().isEmpty(),
  check('skills', 'skills is required').not().isEmpty()
]],
async (req,res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

const {
  website,
  location,
  status,
  skills,
  youtube,
    facebook,
    linkedin


} = req.body;
// Build profile
const profileFields = {};

profileFields.user = req.user.id;
if (website)profileFields.website = website;
if (location)profileFields.location = location;
if (status)profileFields.status = status;
if (skills) {
  profileFields.skills = skills.split(',').map(skills =>skills.trim());
}

//build social object
profileFields.social = {}
if (youtube)profileFields.social.youtube = youtube;
if (facebook)profileFields.social.facebook = facebook;
if (linkedin)profileFields.social.linkedin = linkedin;

try{

let profile = await Profile.findOne ({ user : req.user.id}) ;
if (profile) {
  //Update
  profile = await Profile.findOneAndUpdate ({ user:req.user.id} , {$set: profileFields},
    {new: true}
    );
    return res.json(profile);
}
// Create
profile = new Profile(profileFields);

await profile.save();
res.json(profile);
}catch(err) {
  console.error(err.message);
  res.status(500).send('Server Error');
}
}
);

// GET api/profile
router.get('/', async (req,res) =>{
  try {
const profile = await Profile.find().populate('user', 'name');
res.json(profile);
  }catch (err) {
    console.error(err.message) ;
    res.status(500).send('Server Error');
  }
});

// GET api/profile/user/user_id
router.get('/user/:user_id', async (req,res) =>{
  try {
const profile = await Profile.findOne({ user: req.params.user_id }).populate('user', 'name');
if(!profile) return res.status(400).json ({ msg: 'There is no profile for this user'}) ;

res.json(profile);
  }catch (err) {
    console.error(err.message) ;
if(err.kind == 'ObjectId'){
  return res.status(400).json ({ msg: 'Profile not found'}) ;
}



    res.status(500).send('Server Error');
  }
});

// DELETE api/profile
router.delete('/', auth, async (req,res) =>{
  try {
    // Remove profile
await Profile.findOneAndRemove({ user: req.user.id});
    // Remove user
    await User.findOneAndRemove({ _id: req.user.id});

res.json({ msg : 'User deleted'});
  }catch (err) {
    console.error(err.message) ;
    res.status(500).send('Server Error');
  }
});



  module.exports = router;