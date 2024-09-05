const {PrismaClient} = require("@prisma/client");
const asyncHandler = require("express-async-handler");
const { body } = require("express-validator");
const myError = require("../lib/myError");
const { create_comment, get_child_comments } = require("../prisma/queries/commentQuery");
const { validationHandle } = require("../middleware/validationHandle");
const prisma = new PrismaClient();

exports.getChildComment = asyncHandler(async(req,res,next)=>{
    //req.comment.id 
    //Cursor is only needed for second request onwards

    const id = req.comment.id;
    const cursorId = Number(req.body.cursorId)

    console.log("cursorID",cursorId)

    const comments = await (cursorId? 
        get_child_comments(id,cursorId):
        get_child_comments(id))

    console.log(comments);
    //if comments is null though, i should return an empty cursor
    if (comments.length>0){
        return res.status(200).json({
            comments,
            myCursor:comments[comments.length-1].id
        })
    } else{
        return res.status(200).json({comments,myCursor:null}); //null -> frontend signals no more replies
    }

    // const myCursor = comments? comments[comments.length-1].id: null;
    // myCu
    // return res.status(200).json({comments,myCursor})
    //implement pagination
})


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
    body("postId")
        .trim()
        .isInt(),
    body("parentComment") //Optional
        .optional()
        .trim()
        .isNumeric(),
    validationHandle,

    asyncHandler(async(req,res,next)=>{
        //Comment CAN have parentComment, but that parent comment cannot have parent comment
        //only one layer of parenting allowed
        let {postId,body} = req.body;
        postId = Number(postId);
        const data = {}
        
        if (req.body.parentComment){
            const parentId = Number(req.body.parentComment)
            const exist = await prisma.comment.findUnique({where:{id:parentId}})
            if (!exist) throw new myError(`Parent comment ${parentId} does not exist`,400);
            if (exist.parentCommentId) throw new myError(`Illegal comment: Parent comment is already a child`,400);
            if (exist.postId!=postId) throw new myError(`Illegal comment, parent in different post`,400);
            data.parentCommentId=exist.id;
        }

        
        data.body = body;
        data.postId = postId;
        data.userId=req.user.id;

        const comment = await create_comment(data);

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
            userId_commentId:{
                userId:req.user.id,
                commentId
            }
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