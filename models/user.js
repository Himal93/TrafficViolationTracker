const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

// define the User schema
const userSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true
    },
    mobile:{
        type: Number,
    },
    email:{
        type: String,
        unique: true
    },
    address:{
        type: String,
        required: true
    },
    badgeNumber:{
        type: Number,
        required: true,
        unique: true
    },
    password:{
        type: String,
        required: true
    },
    role:{
        type: String,
        enum: ['trafficpersonal', 'admin'],
        default: 'trafficpersonal'
    }
});

userSchema.pre('save', async function(next){
    const person = this;

    // hash th password only if it has been modified(or new)
    if(!person.isModified('password')) return next();

    try{
        // hash password generation
        const salt = await bcrypt.genSalt(10);

        // hash passowrd
        const hashPassword = await bcrypt.hash(person.password, salt);

        // override the plain password with hashed one
        person.password = hashPassword;
        next();
    }catch(err){
        return next(err);
    }
});

userSchema.methods.comparePassword = async function(candidatePassword){
    try{
        // use bcrypt to compare provided password with hashed password 
        //concept is compare function extract salt from storedhashPassword and uses it to hash the entered password the compares it if they match or not
        const isMatch = await bcrypt.compare(candidatePassword, this.password);
        return isMatch;
    }catch(err){
        throw err;
    }
}

// Create User model
const User = mongoose.model('User', userSchema);
module.exports = User;