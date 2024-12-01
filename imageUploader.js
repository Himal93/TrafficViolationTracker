const cloudinary = require("cloudinary").v2;

const dotenv = require("dotenv");
dotenv.config({ path: "./.env" });

// Configuration
cloudinary.config({
  cloud_name: "draxi7gjy",
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET, // Click 'View API Keys' above to copy your API secret
});

const uploadOnCloudinary = async (localFilePath) => {
  try {
    if (!localFilePath) return "could not find file path";
    // upload file  on cloudinary
    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto",
    });
    // file has upload sucessfully
    console.log("file has upload sucessfully", response.url);
    return response;
  } catch (error) {
    console.log("error from cloudinery", error);
    fs.unlinkSync(localFilePath); //remove the locally save file
    return null;
  }
};

module.exports = { uploadOnCloudinary };
