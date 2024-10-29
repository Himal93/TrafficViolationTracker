const mongoose = require('mongoose');
const { type } = require('os');

// define the User schema
const pedRecordsSchema = new mongoose.Schema({
    licenseNum:{
        type: Number,
        required: true,
        unique: true
    },
    name: {
        type: String,
        required: true
    },
    sex:{
        type: String,
        enum: ['Male', 'Female', 'Others'],
        required: true
    },
    age:{
        type: Number,
        required: true
    },
    dob:{
        type: String,
        required: true
    },
    address:{
        type: String,
        required: true
    },
    violationRecords:[String],
    issuedby:[
        {
            user:{
                type: mongoose.Schema.Types.ObjectId,
                ref: "User",
                required: true
            },
            issuedate:{
                type: Date,
                default: Date.now()
            }
        }
    ]  
});

// Create ped model
const PedRecords = mongoose.model('PedRecords', pedRecordsSchema);
module.exports = PedRecords;