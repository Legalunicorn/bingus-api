const asyncHandler = require("express-async-handler");
const requireAuth = require("./requireAuth");
const {PrismaClient} = require("@prisma/client");
const myError = require("../lib/myError");
const prisma = new PrismaClient();

const ownCommentAuth = [
    requireAuth,
    asyncHandler(async(req,res,next)=>{
        const id = Number(req.params.commentId)
        const comment = await prisma.comment.findUnique({
            where:{id}
        })
        if (!comment){
            res.status(404).send(`comment with ID:${id} does not exist`);
            return;
        }
        if(comment.userId!=req.user.id){
            throw new myError(`COMMENT ${id} not owned by ${req.user.id}`,401)
        }
        req.params.commentId = Number(req.params.commentId) //dont have to do this in controller endpoint
        next(); //sucessful

    })

]

module.exports = ownCommentAuth;