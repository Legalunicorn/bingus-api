const requireAuth = require("./requireAuth");
const asyncHandler = require("express-async-handler");
const myError = require("../lib/myError");

const ownAccountAuth = [
    requireAuth,
    asyncHandler(async(req,res,next)=>{
        const userId = Number(req.body.userId);
        if (userId!=req.user.id){
            throw new myError("Authorization Failed: ownAccountAuth",401)
        } 
        next();
    })

]

module.exports = ownAccountAuth