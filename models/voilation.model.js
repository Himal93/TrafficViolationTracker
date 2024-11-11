const mongoose = require("mongoose");

// Define the violation schema
const violationSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    fine: {
        type: Number,
        required: true
    }
});

// Define the main schema
const violationlistSchema = new mongoose.Schema({
    trafficPersonal: {
        type: String,
        required: true
    },
    licenseNum: {
        type: Number,
        required: true,
    },
    violator: {
        type: String,
        required: true
    },
    violationRecords: [violationSchema],  // Use the violationSchema here
    fine: {
        type: Number,
        required: true
    }
}, { timestamps: true });

// Export the model
const ViolationList = mongoose.model("ViolationList", violationlistSchema);
module.exports = ViolationList ;
