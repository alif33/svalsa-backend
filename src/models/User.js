const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    firstName: { 
      type: String
    },
    lastName: { 
      type: String
    },
    userName: {
      type: String
    },
    email: { 
      type: String, 
      unique: true
    },
    _about: {
      type: String
    },
    _inspiration: {
      type: String
    },
    hobbies: {
      type: Array,
      default: []
    },
    password: { 
      type: String, 
      required: true 
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
