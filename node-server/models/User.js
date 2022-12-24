const mongoose = require("mongoose");

const UserSchema = mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  profileImageURL: {
    type: String,
    required: false,
  },
  major: {
    type: String,
    required: false,
  },
  gradYear: {
    type: String,
    required: false,
  },
  firstName: {
    type: String,
    required: false,
  },
  lastName: {
    type: String,
    required: false,
  },
  userBio: {
    type: String,
    required: false,
  },
  pronouns: {
    type: String,
    required: false,
  },
  fbURL: {
    type: String,
    required: false,
  },
  igURL: {
    type: String,
    required: false,
  },
  scURL: {
    type: String,
    required: false,
  },
  newUser: {
    type: Boolean,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

module.exports = mongoose.model("user", UserSchema);