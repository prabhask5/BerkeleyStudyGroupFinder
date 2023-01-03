const express = require("express");
const router = express.Router();
const token = require("../middleware/tokenCheck");

const User = require("../models/User");

router.get("/me", token, async (req, res) => {
    try {
      const user = await User.findById(req.user.id);
      res.status(200).json(user);
    } catch (e) {
      res.status(202).send({ message: "Error in Fetching user" });
    }
  });

router.get("/allOthers", token, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const users = await User.find({'_id': {$ne: req.user.id}, 'newUser': false}, '_id profileImage major gradYear firstName lastName userBio pronouns courseList');
    res.status(200).json({user: user, users: users});
  } catch (e) {
    res.status(202).send({ message: "Error in Fetching user" });
  }
});

router.get("/allRequests", token, async (req, res) => {
  try {
    const user = await User.findById(req.user.id, '_id email profileImage firstName lastName newUser friendsList outgoingRequestsList incomingRequestsList');
    const friendsList = [];
    for(const friend of user.friendsList){
      const add = await User.findById(friend, '_id profileImage firstName lastName fbURL igURL scURL major gradYear userBio pronouns courseList email');
      friendsList.push(add);
    }
    const outgoingRequestsList = [];
    for(const oRequest of user.outgoingRequestsList){
      const add = await User.findById(oRequest, '_id profileImage firstName lastName major gradYear userBio pronouns courseList');
      outgoingRequestsList.push(add);
    }
    const incomingRequestsList = [];
    for(const iRequest of user.incomingRequestsList){
      const add = await User.findById(iRequest, '_id profileImage firstName lastName major gradYear userBio pronouns courseList');
      incomingRequestsList.push(add);
    }
    res.status(200).json({user: user, friendsList, outgoingRequestsList, incomingRequestsList});
  } catch (e) {
    res.status(202).send({message: "Error in Fetching user"});
  }
});
  
module.exports = router;