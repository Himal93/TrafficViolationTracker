const multer = require("multer");
const path = require("path");
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const tempPath = path.join(__dirname, "../public/temp");
    cb(null, tempPath);
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const Upload = multer({ storage });

module.exports = Upload;
