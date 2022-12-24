const config = require("dotenv").config;
const mongoose = require("mongoose");

mongoose.set('strictQuery', true);
config();

const InitiateMongoServer = async () => {
  try {
    await mongoose.connect(process.env.DB_URI, {
        dbName: "berkeleyStudyGroupWebsite",
        useNewUrlParser: true,
    });
    console.log("Connected to DB !!");
  } catch (e) {
    console.log(e);
    throw e;
  }
};

module.exports = InitiateMongoServer;