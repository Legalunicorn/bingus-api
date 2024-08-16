
const upload = require("../config/multer")

const multerCheckFile = (req,res,next)=>{
    if (req.file!==undefined){
        upload.single("attachment")
    } else next();
}

module.exports = multerCheckFile