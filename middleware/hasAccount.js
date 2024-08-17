
const jwt = require("jsonwebtoken");
const {PrismaClient} = require("@prisma/client");
const prisma = new PrismaClient();
const asyncHandler = require("express-async-handler");
const myError = require("../lib/myError");


//make sure has u
const hasAccount = asyncHandler(async(req,res,next)=>{
    const auth = req.headers.authorization
    if (!auth){
        throw new myError("Auth headers missing",401)
    }
    const token = auth.split(" ")[1];
    let id;
    jwt.verify(token,process.env.SECRET,(err,decoded)=>{
        //TODO frontend to check if its TokenExpiredError
        if (err) next(new myError(err.name,401)) //err.name ="TokenEpiredError"
        id = decoded.id;  
    })
    req.user = await prisma.user.findUnique({where:{id}})

    next();
})

module.exports = hasAccount;