//Config from fileUploaderProject
const multer = require("multer");
const storage = multer.memoryStorage();
const uploader = multer({storage:storage})
module.exports = uploader;

//Store files in memeory => in a buffer
//upload to cloudinary using a buffer