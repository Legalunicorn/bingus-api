const {PrismaClient} = require("@prisma/client");
const asyncHandler = require("express-async-handler");
const {user_posts, all_posts, get_post, get_following_posts, create_post, delete_post, update_post } = require("../prisma/postQueries");
const { body } = require("express-validator");
const prisma = new PrismaClient();
const {validationHandle} = require("../middleware/validationHandle")
const { uploadStream, deleteFile } = require("../utils/cloudinaryUtil");
const myError = require("../lib/myError");
const upload = require("../config/multer")


exports.getManyPosts = asyncHandler(async(req,res,next)=>{ //DONE, actually why did i make this for? the feed will ge tall post no?
    const userId = Number(req.query.userId); //user if valid 
    const posts = await (userId? user_posts(userId): all_posts()); //depends if userId was supplied in query
    //Debugging
    console.log("getPosts user: ",userId)
    console.log(posts)
    res.status(200).json({posts})
})

exports.getPost = asyncHandler(async(req,res,next)=>{ //DONE
    const postId = Number(req.params.postId)
    const post = await get_post(postId);
    if (!post) return res.status(404).json({error:`Post if ID:${postId} not found.`})
    return res.status(200).json(post)  
})

exports.getFollowingPosts = asyncHandler(async(req,res,next)=>{
    const posts = await get_following_posts(req.user.id);
    res.status(200).json(posts)
})

exports.createPost = [
    upload.single("attachment"),
    (req,res,next)=>{
        if (!Array.isArray(req.body.tags)){
            req.body.tags = typeof req.body.tags==="undefined"? []:[req.body.tags];
        }
        next();
    },
    body("body")
        .trim()
        .isLength({min:1})
        .withMessage("Text body must not be empty"),
    body("tags.*")
        .trim()
        .toLowerCase(),
        // .escape(), //TODO see what this does, how about no?
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
        console.log("In side post controller: ",req.body)


        const data = {};
        data.userId = req.user.id;
        data.body = req.body.body
        console.log("Logging req file",req.file)
        if (!req.file) throw new myError("file empty",400);
        if (req.file.mimetype=='raw'){
            throw new myError("Invalid file uploaded",400);
        }
        if (req.file){
            const result = await uploadStream(req.file.buffer,"bingus");
            data.attachment = result.secure_url;
            data.public_id = result.public_id;
        }
        if (req.body.gitLink) data.gitLink = req.body.gitLink
        if (req.body.repoLink) data.repoLink = req.body.repoLink
        if (req.body.tags.length>0){
            data.tags = {
                connectOrCreate: req.body.tags.map(name=>({
                    where:{name},
                    create:{name}
                }))
            }
        }
        const post  = await create_post(data); 
        res.status(200).json({post}) 
    })
]

exports.deletePost = asyncHandler(async(req,res,next)=>{ 
    //Middleware has checked the req.user is the owner of postId
    const post = req.post;
    console.log("del post:",post);
    if (post.attachment && post.public_id){ //not null
        console.log("has attachkment")
        const [file,result] = await Promise.all([
            delete_post(post.id),
            deleteFile(post.public_id)
        ])
        console.log("Result from cloudinary file deletion: ",result)
        return res.status(200).json({file});
    } else{ //no need to delete from cloudinary
        const file = await delete_post(post.id);
        return res.status(200).json({file});
    }


})


exports.patchPostLink = [
    body("parentPostId")
        .trim()
        .isInt(),

    validationHandle,
    asyncHandler(async(req,res,next)=>{
        //OwnpostAuth -> verifies post is own by User + post exists
        //Check the parent post is an actual post
        const parentId = Number(req.body.parentPostId);
        if (parentId==req.post.id)throw new myError("Cannot Link post to itself",400);

        const parentExist = await prisma.post.findUnique({
            where:{id:parentId},
            select:{
                author:{
                    select:{id:true}
                }
            }
        })
        //i can instead use connect and make 1 query instead of 2
        //however the error will be thrown by prisma and might be confusing 
        if (!parentExist) throw new myError(`Parent ID ${parentId} does not exist`,400);
        if (parentExist.author.id!=req.user.id) throw new myError(`ParentID post does not being to user`,403);
        const updatedPost = await prisma.post.update({
            where:{id:req.post.id},
            data:{
                nextPostId:parentId
            },
            select:{
                id:true,
            }
        })
        res.status(200).json({postId:updatedPost.id});
    })
]

exports.updatePost = [
    body("body")
        .optional()
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
        const postData = {}
        postData.id =postId;
        if (req.body.body) postData.body = req.body.body;
        if (req.body.repoLink) postData.repoLink = req.body.repoLink;
        if (req.body.gitLink) postData.gitLink = req.body.gitLink;
        if (req.body.tags && req.body.tags.length>0){
            postData.tags = {
                connectOrCreate: req.body.tags.map(name=>({
                    where:{name},
                    create:{name}
                }))
            }
        }

        const post = await update_post(postId,postData);
        res.status(200).json({post})

    })
        
]

exports.likePost = asyncHandler(async(req,res,next)=>{
    //check if post exist //TODO make exist a middleware
    const postId = Number(req.params.postId)
    const exist = await prisma.post.findUnique({where:{id:postId}})
    console.log("exist",exist);
    if (!exist) return res.status(404).json({error:`Post ${postId} does not exist`});
    const result = await prisma.postLike.upsert({
        where:{
            userId_postId:{
                userId:req.user.id,
                postId
            }
        },
        update:{},
        create:{
            userId:req.user.id,
            postId

        }
    })
    const post = await get_post(postId)
    return res.status(200).json({post})
 })


 exports.unlikePost =asyncHandler(async(req,res,next)=>{
    const postId = Number(req.params.postId)
    const exist = await prisma.post.findUnique({where:{id:postId}})
    if (!exist) return res.status(404).json({error:`Post ${postId} does not exist`});
    const result = await prisma.postLike.deleteMany({
        where:{
            userId:req.user.id,
            postId
        
        },
    })
    const post = await get_post(postId)
    return res.status(200).json({post});
 })