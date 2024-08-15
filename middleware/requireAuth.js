/**
 * Steps
 * 1. Get token from req.headers
 * 2. if token not exist -> Error
 * 3. verify token, and check for expired token
 * 4. if error throw An Error with JWT
 * 5. populate req.user with info and pass to the next middleware
 */

const jwt = require("jsonwebtoken");
const {PrismaClient} = require("@prisma/client");
const prisma = new PrismaClient();
const asyncHandler = require("express-async-handler");
const myError = require("../lib/myError");

const requireAuth = asyncHandler(async(req,res,next)=>{
    const auth = req.headers.authorization
    if (!auth){
        throw new myError("Auth headers missing",401)
    }
    const token = auth.split(" ")[1];
    let id;
    jwt.verify(token,process.env.SECRET,(err,decoded)=>{
        //TODO frontend to check if its TokenExpiredError
        if (err) next(new myError(err.name,401))
        id = decoded.id;  
    })
    req.user = await prisma.user.findUnique({where:{id}})
    console.log("===required auth gained =====",req.user.id);
    next();
})

module.exports = requireAuth;