const express = require("express");
const cloudinary = require("cloudinary").v2;
const config = require("dotenv").config;
const { validationResult } = require("express-validator");

config();
const router = express.Router();
const User = require("../models/User");
cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET,
});

router.post(
    "/updateInfo",
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(202).json({
              errors: errors.array(),
            });
        }
        const { id, email, profileImageFile, firstName, lastName, major, gradYear, userBio, pronouns, fbURL, igURL, scURL } = req.body;
        try {
            let user = await User.findById(id);
            if(!user.newUser && profileImageFile != "") await cloudinary.uploader.destroy(user.profileImagePublicURL);
            response = profileImageFile === "" ? {secure_url: user.profileImage ? user.profileImage: "", public_id: user.public_id ? user.public_id: ""}: await cloudinary.uploader.upload(profileImageFile, {folder: "berkeleyStudyGroupService"}).catch(error => {console.log(error)
                throw error});
            let newUser;
            if (!user.completedStartProfile) {
                newUser = await User.findByIdAndUpdate(id, { $set: {
                    email: email,
                    profileImage: response.secure_url,
                    profileImagePublicURL: response.public_id,
                    firstName: firstName,
                    lastName: lastName,
                    major: major,
                    gradYear: gradYear,
                    userBio: userBio,
                    pronouns: pronouns,
                    fbURL: fbURL,
                    igURL: igURL,
                    scURL: scURL,
                    completedStartProfile: !user.completedStartProfile,
                }});
            } else {
                newUser = await User.findByIdAndUpdate(id, { $set: {
                    email: email,
                    profileImage: response.secure_url,
                    profileImagePublicURL: response.public_id,
                    firstName: firstName,
                    lastName: lastName,
                    major: major,
                    gradYear: gradYear,
                    userBio: userBio,
                    pronouns: pronouns,
                    fbURL: fbURL,
                    igURL: igURL,
                    scURL: scURL,
                }});
            }
            if (!newUser || !user)
                return res.status(202).json({
                message: "User Not Exist",
                    });
            await newUser.save();
            res.status(200).json({profileImage: response.secure_url});
        } catch (e) {
            console.error(e);
            res.status(202).json({
              message: "Server Error",
            });
          }
    }
);

router.post(
    "/updateCourseInfo",
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(202).json({
              errors: errors.array(),
            });
        }
        const { id, courseList } = req.body;
        try {
            const newUserData = await User.findById(id);
            let user;
            if(newUserData.newUser){
                user = await User.findByIdAndUpdate(id, { $set: {
                    courseList: courseList,
                    newUser: !newUserData.newUser,
                }});
            } else {
                user = await User.findByIdAndUpdate(id, { $set: {
                    courseList: courseList,
                }});
            }
            if (!user)
                return res.status(202).json({
                message: "User Not Exist",
                    });
            await user.save();
            res.status(200).json(user);
        } catch (e) {
            console.error(e);
            res.status(202).json({
              message: "Server Error",
            });
          }
    }
);

module.exports = router;