const express = require("express");
const { validationResult } = require("express-validator");

const router = express.Router();
const User = require("../models/User");

router.post(
    "/sendFriend",
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(202).json({
              errors: errors.array(),
            });
        }
        const { id, friendId } = req.body;

        try {
            const sendUser = await User.findById(id);
            const recieveUser = await User.findById(friendId);
            const newOutgoingList = [...sendUser.outgoingRequestsList, friendId];
            const newIncomingList = [...recieveUser.incomingRequestsList, id];
            const user = await User.findByIdAndUpdate(id, { $set: {
                outgoingRequestsList: newOutgoingList,
            }});
            await User.findByIdAndUpdate(friendId, { $set: {
                incomingRequestsList: newIncomingList,  
            }});
            if (!user)
                return res.status(202).json({
                message: "User Not Exist",
                    });
            await user.save();
            res.status(200).json({});
        } catch (e) {
            console.error(e);
            res.status(202).json({
              message: "Server Error",
            });
        }
    }
);

router.post(
    "/deleteIncoming",
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(202).json({
              errors: errors.array(),
            });
        }
        const { id, friendId } = req.body;

        try {
            const sendUser = await User.findById(id);
            const recieveUser = await User.findById(friendId);
            const newIncomingList = sendUser.incomingRequestsList.filter(d => d != friendId);
            const newOutgoingList = recieveUser.outgoingRequestsList.filter(d => d != id);
            const user = await User.findByIdAndUpdate(id, { $set: {
                incomingRequestsList: newIncomingList,
            }});
            await User.findByIdAndUpdate(friendId, { $set: {
                outgoingRequestsList: newOutgoingList,  
            }});
            if (!user)
                return res.status(202).json({
                message: "User Not Exist",
                    });
            await user.save();
            res.status(200).json({});
        } catch (e) {
            console.error(e);
            res.status(202).json({
              message: "Server Error",
            });
        }
    }
);

router.post(
    "/deleteOutgoing",
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(202).json({
              errors: errors.array(),
            });
        }
        const { id, friendId } = req.body;

        try {
            const sendUser = await User.findById(id);
            const recieveUser = await User.findById(friendId);
            const newOutgoingList = sendUser.outgoingRequestsList.filter(d => d != friendId);
            const newIncomingList = recieveUser.incomingRequestsList.filter(d => d != id);
            const user = await User.findByIdAndUpdate(id, { $set: {
                outgoingRequestsList: newOutgoingList,
            }});
            await User.findByIdAndUpdate(friendId, { $set: {
                incomingRequestsList: newIncomingList,  
            }});
            if (!user)
                return res.status(202).json({
                message: "User Not Exist",
                    });
            await user.save();
            res.status(200).json({});
        } catch (e) {
            console.error(e);
            res.status(202).json({
              message: "Server Error",
            });
        }
    }
);

router.post(
    "/deleteFriend",
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(202).json({
              errors: errors.array(),
            });
        }
        const { id, friendId } = req.body;

        try {
            const sendUser = await User.findById(id);
            const recieveUser = await User.findById(friendId);
            const newUserFriendsList = sendUser.friendsList.filter(d => d != friendId);
            const newFriendFriendsList = recieveUser.friendsList.filter(d => d != id);
            const user = await User.findByIdAndUpdate(id, { $set: {
                friendsList: newUserFriendsList,
            }});
            await User.findByIdAndUpdate(friendId, { $set: {
                friendsList: newFriendFriendsList,
            }});
            if (!user)
                return res.status(202).json({
                message: "User Not Exist",
                    });
            await user.save();
            res.status(200).json({});
        } catch (e) {
            console.error(e);
            res.status(202).json({
              message: "Server Error",
            });
        }
    }
);

router.post(
    "/acceptIncoming",
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(202).json({
              errors: errors.array(),
            });
        }
        const { id, friendId } = req.body;

        try {
            const sendUser = await User.findById(id);
            const recieveUser = await User.findById(friendId);
            const newIncomingList = sendUser.incomingRequestsList.filter(d => d != friendId);
            const newUserFriendsList = [...sendUser.friendsList, friendId];
            const newOutgoingList = recieveUser.outgoingRequestsList.filter(d => d != id);
            const newFriendFriendsList = [...recieveUser.friendsList, id];
            const user = await User.findByIdAndUpdate(id, { $set: {
                incomingRequestsList: newIncomingList,
                friendsList: newUserFriendsList,
            }}, {new: true});
            await User.findByIdAndUpdate(friendId, { $set: {
                outgoingRequestsList: newOutgoingList,
                friendsList: newFriendFriendsList,  
            }});
            if (!user)
                return res.status(202).json({
                message: "User Not Exist",
                    });
            await user.save();
            const friendsList = [];
            for(const friend of user.friendsList){
                const add = await User.findById(friend, '_id profileImage firstName lastName fbURL igURL scURL major gradYear userBio pronouns courseList email');
                friendsList.push(add);
            }
            res.status(200).json({friendsList: friendsList});
        } catch (e) {
            console.error(e);
            res.status(202).json({
              message: "Server Error",
            });
        }
    }
);

 module.exports = router;