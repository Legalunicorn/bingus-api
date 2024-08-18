const {PrismaClient} = require("@prisma/client");
const asyncHandler = require("express-async-handler");
const { get_all_users, get_user_details, get_followers, delete_user } = require("../prisma/userQueries");
const { body, param } = require("express-validator");
const {validationHandle} = require("../middleware/validationHandle");
const multerCheckFile = require("../middleware/multerCheckFile");
const myError = require("../lib/myError");
const { uploadStream, deleteFile } = require("../utils/cloudinaryUtil");
const prisma = new PrismaClient();


exports.getAllUsers = asyncHandler(async(req,res,next)=>{
    const users = await get_all_users();
    res.status(200).json({users})
})

/**
 * Scope
 * - get all the profile
 * - get all the POST
 * - get all following/followers
 * 
 * undecided:
 *  get comments(?) and likes(?)
 * 
 */
exports.getUserDetails = [
    param("userId")
        .trim()
        .isNumeric(),

    asyncHandler(async(req,res,next)=>{
        const id = Number(req.user.id);
        const user = await get_user_details(id);
        if (user===null){
            return res.status(404).json({error:`User with od:${id} not found.`})
        } else{
            res.status(200).json({user});
        }
        //get users, if empty throw 404
    })

]

exports.getFollowers = [
    param("userId")
        .trim()
        .isNumeric(),

    asyncHandler(async(req,res,next)=>{
        //check if user exists first 
        const id = Number(req.params.userId);
        const exist = await prisma.user.findUnique({where:{id}});
        if (!exist) return res.status(404).json({error:`UserID ${id} does not exist.`})
        
        const followers = await get_followers(id);
        res.status(200).json({followers});
    })
]

exports.getFollowing = [
    param("userId")
        .trim()
        .isNumeric(),

    asyncHandler(async(req,res,next)=>{
        //check if user exists first 
        const id = Number(req.params.userId);
        const exist = await prisma.user.findUnique({where:{id}});
        if (!exist) return res.status(404).json({error:`UserID ${id} does not exist.`})
        
        const followers = await get_followers(id);
        res.status(200).json({followers});
    })
]
// bio, profilePicture, website github,
/*
- same as the create post 
- 
*/
exports.patchProfile = [
    param("userId","invalid user id")
        .trim()
        .isNumeric(),
    body("bio")
        .trim()
        .isLength({max:350})
        .withMessage("max bio length is 350"),

    body("website") 
        .optional()
        .trim()
        .isURL()
        .withMessage("website not valid url"),

    body("github")
        .optional()
        .trim()
        .isURL()
        .withMessage("github not valid url"),

    validationHandle,
    multerCheckFile,

    asyncHandler(async(req,res,next)=>{
        //User is validated to be OWNER based on middleware in routes 
        //all is optional here which is a mess
        // maybe we make them not optional-?
        //  user is in req.user
        //
        const updateData = {id:req.user.id}
        
        if (req.file){
            //reject NON-images
            if (req.file.mimetype!=='image'){
                throw new myError("Only image uploads allowed for profilPicture",400);
            }
            //upload new picture
            const result = await uploadStream(req.file.buffer)
            //success upload, delete old pfp
            if (req.user.public_id){
                const deleted = await deleteFile(req.user.public_id); //delete this
                console.log("deleted: ",deleted)
            }
            updateData.attachment = result.secure_url;
            updateData.public_id = result.public_id;
        }
        if (req.body.github) updateData.github=req.body.github
        if (req.body.website) updateData.website=req.body.website
        updateData.bio = req.body.bio;
        
        const user = await update_user(id,updateData)
        res.status(200).json({user})


    })
]

exports.patchSetting = [
    body("theme")
        .trim()
        .isIn(['dark','light']),

    validationHandle,
    asyncHandler(async(req,res,next)=>{
        //just update settings, dont need to return anything honestly
        const isDarkMode = req.body.theme==="dark";
        const settings = await prisma.userSettings.update({
            where:{userId:id},
            data:{
                isDarkMode
            }
        })
        res.status(200).json({settings})
    })


]

exports.deleteUser = asyncHandler(async(req,res,next)=>{
    
    const user = await delete_user(req.user.id);
    res.status(200).json({user})
})

exports.followUser = asyncHandler(async(req,res,next)=>{
    /*
    should follow and unfollow be seperate endpoints?

    1. we search from Follow Table to check if the record exit
    2. if the record exist, im not sure to throw an error or not. i guess not 
    To avoid throwing an Error, use deleteMany()

    */
   const result = await prisma.follow.upsert({
        where:{
            followerId:req.user.id,
            followingId:req.params.userId
        },
        create:{
            followerId:req.user.id,
            followingId:req.params.userId
        },
        update:{
            createdAt: Date()
        }

   })
   console.log("Result of follow",result)
   res.status(200).json({result})
})

exports.unfollowUser = asyncHandler(async(req,res,next)=>{
    const result = await prisma.follow.deleteMany({
        where:{
            followerId:req.user.id,
            followingId:req.params.userId
        }
   })
   console.log("Result of unfollow",result)
   res.status(200).json({result})
})