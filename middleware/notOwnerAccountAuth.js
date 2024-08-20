const requireAuth = require("./requireAuth");
const asyncHandler = require("express-async-handler");
const myError = require("../lib/myError");

const notOwnerAccountAuth = [
    requireAuth,
    asyncHandler(async(req,res,next)=>{
        const userId = Number(req.params.userId);
        if (userId===req.user.id){ //user in param must be differeent
            throw new myError("Authorization Failed: notOwnerAccountAuth",401)
        }
        next();
    })

]

module.exports = notOwnerAccountAuth