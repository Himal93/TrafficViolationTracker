const mongoose = require('mongoose');

const RuleSchema = new mongoose.Schema({
    title:{
        type: String,
        required: true
    },
    description:{
        type: String
    }
})

const Rule = mongoose.model('Rule', RuleSchema);
module.exports = Rule;