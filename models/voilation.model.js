const mongoose = require("mongoose")

const violation = new mongoose.Schema({
    title:{
            type: String,
            required: true
        },
        fine:{
            type: Number,
            required: true
        }
    });

const violationlistSchema = new mongoose.Schema({
    
 trafficPersonal:{
    type:String,
    required:true
 },
 licenseNum:{
    type:Number,
    required:true,
    unique: true
 },
 violator:{
    type: String,
    required: true
 },
 violationRecords:[violation],
 fine:{
    type: Number,
    required: true
    }
},{timestamps: true});

export     const violationlist =mongoose.Schema("violationlist",violationlistSchema)