
const asyncHandler = require("@prisma/client");
const prisma = new asyncHandler.Prisma();

const commentExist = asyncHandler(async(req,res,next)=>{
    const id = Number(req.params.commentId);
    const exist = await prisma.comment.findUnique({where:{id}})
    if (!exist) return res.status(404).json({error:`comment${id} does not exist`})
    
    req.comment = exist;
    next();
})

module.exports = commentExist