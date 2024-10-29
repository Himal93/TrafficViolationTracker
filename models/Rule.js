const mongoose = require('mongoose');

const RuleSchema = new mongoose.Schema({
    title:{
        type: String,
        required: true
    },
    fine:{
        type: Number,
        required: true
    }
});

const Rule = mongoose.model('Rule', RuleSchema);
module.exports = Rule;