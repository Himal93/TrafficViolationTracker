const mongoose = require('mongoose');

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
        enum: ['Male', 'Female'],
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
    violationRecords:[],
},{timestamps:true});

// Create ped model
const PedRecords = mongoose.model('PedRecords', pedRecordsSchema);
module.exports = PedRecords;