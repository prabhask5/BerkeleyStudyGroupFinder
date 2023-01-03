const placeHolderData = require("../../testdata");
const User = require("../models/User");

const InitiateTestData = async () => {
    try {
      await User.insertMany(placeHolderData);
      console.log("inserted test data!");
    } catch (e) {
      console.log(e);
      throw e;
    }
  };
  
  module.exports = InitiateTestData;