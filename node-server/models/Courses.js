const mongoose = require("mongoose");

const CourseSchema = mongoose.Schema({
    courseAbrName: {
        type: String,
        required: true,
    },
    courseLongName: {
        type: String,
        required: true,
    },
    classNumber: {
        type: String,
        required: true,
    },
    disNumber: {
        type: String,
        required: false,
    },
    labNumber: {
        type: String,
        required: false,
    }
});

module.exports = CourseSchema;