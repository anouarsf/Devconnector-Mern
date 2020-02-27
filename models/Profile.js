const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create Schema
const ProfileSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "user"
  },

  website: {
    type: String
  },
  location: {
    type: String
  },
  status: {
    type: String,
    required: true
  },
  skills: {
    type: [String],
    required: true
  },

  social: {
    youtube: {
      type: String
    },

    facebook: {
      type: String
    },
    linkedin: {
      type: String
    }
  }
});

module.exports = Profile = mongoose.model("profile", ProfileSchema);
