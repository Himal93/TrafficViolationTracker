const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const User = require('./models/user');
const dotenv=require("dotenv")
dotenv.config({
  path: "./.env",
});

mongoose.connect(process.env.MONGODB_URL, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log('MongoDB connection error:', err));

const seedAdminUser = async () => {
  const name="Himal Rana";
  const mobile=9815480618;
  const address="Butwal";
   const badgeNumber=7852;
  const password = 'admin123'; // Set the admin password

try{
  const existingUser = await User.findOne({ badgeNumber });
  if (existingUser) {
    console.log('Admin user already exists');
    return;
  }

  const adminUser = new User({
    name,
    mobile,
    address,
    badgeNumber,
    password,
    role: 'admin'
  });

  await adminUser.save();
  console.log('Admin user created successfully');
} catch (error){
  console.log('Error creating admin user:', error)
} finally {
  mongoose.connection.close();
}
};

seedAdminUser();