const {PrismaClient} = require("@prisma/client");
const asyncHandler = require("express-async-handler");
const {user_posts, all_posts, get_post, get_following_posts, create_post, delete_post, update_post } = require("../prisma/postQueries");
const { body } = require("express-validator");
const { upsert_tags } = require("../prisma/tagQueries");
const prisma = new PrismaClient();
const validationHandle = require("../middleware/validationHandle")


exports.getManyPosts = asyncHandler(async(req,res,next)=>{
    const userId = req.query.id; //user if valid 
    const posts = await (userId? user_posts(userId): all_posts()); //depends if userId was supplied in query
    //Debugging
    console.log("getPosts user: ",userId)
    console.log(posts)
    res.status(200).json({posts})
})

exports.getPost = asyncHandler(async(req,res,next)=>{
    const postId = Number(req.params.postId)
    //check if post exist
    const exist = await prisma.post.findUnique({
        where:{id:postId}
    })
    if (!exist) return res.status(404).json({error:`Post if ID:${postId} not found.`})
    const post = await get_post(id);
    res.status(200).json(post)  
})

exports.getFollowingPosts = asyncHandler(async(req,res,next)=>{
    //user already from middleware
    const posts = await get_following_posts(req.user.id);
    res.status(200).json(posts)
})

/**
 * STAGE 1:
 * - create posts without and attachments first
 *  FIELDS
 *  - gitLink
 *  - repoLink
 *  - userId
 *  - body
 *  - tags
 * STAGE 2: 
 * Set up multer and cloudinary first in order to handle media
 * 
 */
exports.createPost = [
    body("body")
        .trim()
        .isLength({min:1})
        .withMessage("Text body must not be empty"),
    body("tags.*")
        .trim()
        .escape(), //TODO see what this does
    body("gitLink")
        .optional()
        .trim()
        .isURL(),
    body("repoLink")
        .optional()
        .trim()
        .isURL(),
    
    validationHandle,

    asyncHandler(async(req,res,next)=>{

        //BUG tags are optional
        const body = req.body.body;
        //handle tags if it exists
        const createdTags = await (req.body.tags? upsert_tags(req.body.tags): undefined)
        //createdTags shall be an optional parameter
        const barePost = await create_post(body,req.user.id,createdTags)
        
        //3. get optional values and update
        if (req.body.attachment){
            //Do the multer and cloudinary nonsense here,
            // then link the attachment to the post
        }
        if (req.body.gitLink) post.gitLink = req.body.gitLink
        if (req.body.repoLink) post.repoLink = req.body.repoLink
        
        const post = await prisma.post.update({ //3. fill in optinal values and update (?)
            where:{
                id:barePost.id
            },
            data:{
                barePost
            }
        })
        res.status(200).json({post}) 
    })
]

exports.deletePost = asyncHandler(async(req,res,next)=>{
    //Middleware has checked the req.user is the owner of postId
    const postId = req.params.postId;
    const post = await delete_post(postId)
    res.status(200).json({post})
})

exports.updatePost = [
    body("body")
        .trim()
        .notEmpty(),
    body("tags.*")
        .trim()
        .notEmpty(),
    body("repoLink")
        .optional()
        .trim()
        .isURL(),
    body("gitLink")
        .optional()
        .trim()
        .isURL(),


    validationHandle,

    asyncHandler(async(req,res,next)=>{
        //you can only update the body and tags 
        // 1. get the post, set the data if the post is there
        const postId = req.params.postId;
        const body = req.body.body;
        const createdTags = await (req.body.tags? upsert_tags(req.body.tags): undefined)

        const postData = {}
        postData.id =postId;
        postData.body = body;
        if (repoLink) postData.repoLink = repoLink;
        if (gitLink) postData.gitLink = gitLink;

        const post = await update_post(postId,postData,createdTags);
        res.status(200).json({post})

    })
        
]