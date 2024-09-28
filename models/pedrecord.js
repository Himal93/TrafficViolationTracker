const mongoose = require('mongoose');
const { type } = require('os');

// define the User schema
const pedRecordsSchema = new mongoose.Schema({
    licenseNum:{
        type: Number,
        required: true,
        unique: true
    },
    firstName:{
        type: String,
        required: true
    },
    lastName:{
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
        unique: true
    },
    dob:{
        type: String,
        required: true
    },
    address:{
        type: String,
        required: true
    },
    issuedby:[
        {
            user:{
                type: mongoose.Schema.Types.ObjectId,
                ref: "User",
                required: true
            },
            issuedat:{
                type: Date,
                default: Date.now()
            }
        }
    ],
    timesStopped: {
        type: Number,
        default: 0
    }
});

// Create User model
const PedRecords = mongoose.model('PedRecords', pedRecordsSchema);
module.exports = PedRecords;