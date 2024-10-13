/**
 * Steps
 * 1. Get token from req.headers
 * 2. if token not exist -> Error
 * 3. verify token, and check for expired token
 * 4. if error throw An Error with JWT
 * 5. populate req.user with info and pass to the next middleware
 */

const {PrismaClient} = require("@prisma/client");
const asyncHandler = require("express-async-handler");
const myError = require("../lib/myError");
const hasAccount = require("./hasAccount")


//make sure has u
const requireAuth =[
    hasAccount, //Make sure it is a register account

    //Make sure account has a username (oauth protection procedure)
    asyncHandler(async(req,res,next)=>{
        if (!req.user.username){
            throw new myError("User does not have username",401);
        }
        // console.log("===required auth gained =====",req.user.id);
        // console.log("Logging req.body: ",req.body)
        next();
    })
]

module.exports = requireAuth;