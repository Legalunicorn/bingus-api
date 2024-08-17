const {PrismaClient} = require("@prisma/client");
const asyncHandler = require("express-async-handler");
const { body,query } = require("express-validator");
const myError = require("../lib/myError");
const { create_comment } = require("../prisma/commentQuery");
const { validationHandle } = require("../middleware/validationHandle");
const prisma = new PrismaClient();


exports.deleteComment = asyncHandler(async(req,res,next)=>{
    //User delete many to now throw error, we handle the error ourselves

    const comment = await prisma.comment.delete({
        where:{
            id:req.params.commentId
        },
        select:{
            id:true //return id so frontend can clear it off
        }
    })
    console.log("deleted comment result: ",result)
    res.status(200).json({comment})

    
})


exports.postComment = [
    body("body")
        .trim()
        .isLength({min:1,max:400}),
    query("parentComment")
        .optional()
        .trim()
        .isNumeric(),
    validationHandle,

    asyncHandler(async(req,res,next)=>{
        //Comment CAN have parentComment, but that parent comment cannot have parent comment
        //only one layer of parenting allowed
        
        if (req.query.parentComment){
            const parentId = Number(req.query.parentComment)
            const exist = await prisma.comment.findUnique({where:{id:parentId}})
            if (!exist) throw new myError(`Parent comment ${parentId} does not exist`,400);
            if (exist.parentCommentId) throw new myError(`Illegal comment: Parent comment is already a child`,400);
        }

        const comment = await( req.query.parentComment?
            create_comment(req.user.id,req.body.body,req.query.parentComment)
            :create_comment(req.user.id,req.body.body))

        res.status(200).json({comment});
    })
]

exports.deleteComment = asyncHandler(async(req,res,next)=>{
    //return the id will do 
    const id = req.params.commentId;
    const comment = await prisma.comment.delete({
        where:{
            id
        },
        select:{
            id
        }
    })
    return res.status(200).json({comment});
})


exports.postCommentLike = asyncHandler(async(req,res,next)=>{
    const commentId = req.comment.id;
    const result = await prisma.commentLike.upsert({
        where:{
            userId:req.user.id,
            commentId
        },
        update:{},
        create:{
            userId:req.user.id,
            commentId
        }
    })
    res.status(200).json({result})
})

exports.postCommentUnlike = asyncHandler(async(req,res,next)=>{
    const commentId = req.comment.id;
    const result = await prisma.commentLike.deleteMany({
        where:{
            userId:req.user.id,
            commentId
        },
    })
    console.log("deleted:",result)
    res.status(200).json({result})
})