
const upload = require("../config/multer")

//TODO remove this middleware, its obsolelte

const multerCheckFile = (req,res,next)=>{
    upload.single("attachment")
    // if (req.file!==undefined){
    //     upload.single("attachment")
    // } else next();
    console.log("Post multer: ",req.body)
    next();
}

module.exports = multerCheckFile 