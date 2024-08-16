const asyncHandler = require("express-async-handler");
const requireAuth = require("./requireAuth");
const {PrismaClient} = require("@prisma/client");
const myError = require("../lib/myError");
const prisma = new PrismaClient();

/**
 * Retrive post information from request
 * verify request is from authenticated user
 * verifiy request is authorised (owner of post etc)
 * Parse the id of the post to Number() back into request
 * 
 * 
 * 
 * NEW FEATURE
 * -> since the post is found, just pass it in the req.body or something
 */
const ownPostAuth = [
    requireAuth,
    asyncHandler(async(req,res,next)=>{
        const id = Number(req.params.postId)
        const post = await prisma.post.findUnique({
            where:{id}
        })
        if (!post){
            res.status(404).send(`Post with ID:${id} does not exist`);
            return;
        }

        if(post.userId!=req.user.id){
            throw new myError(`POST ${id} not owned by ${req.user.id}`,401)
        }

        req.params.postId = Number(req.params.postId) //dont have to do this in controller endpoint
        //Put post in request
    req.post = post;    
        next(); //sucessful

    })

]

module.exports = ownPostAuth;