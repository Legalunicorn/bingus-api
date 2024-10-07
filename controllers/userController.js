const {PrismaClient} = require("@prisma/client");
const asyncHandler = require("express-async-handler");
const { get_all_users, get_user_details, get_followers, delete_user, update_user, get_following } = require("../prisma/queries/userQueries");
const { body, param } = require("express-validator");
const {validationHandle} = require("../middleware/validationHandle");
const upload = require("../config/multer")
const myError = require("../lib/myError");
const { uploadStream, deleteFile } = require("../utils/cloudinaryUtil");
const prisma = new PrismaClient();


exports.getAllUsers = asyncHandler(async(req,res,next)=>{
    //Add query
    const search = req.query.search;
    console.log("search is : ",search)
    const currUser = req.user.id
    const users = await (search? get_all_users(currUser,search): get_all_users(currUser));
    //
    // const users = await get_all_users();
    res.status(200).json({users})
})

exports.getUserDetails = [
    param("userId")
        .trim()
        .isNumeric(),

    asyncHandler(async(req,res,next)=>{
        // const id = Number(req.user.id);//
        const id = Number(req.params.userId);
        const user = await get_user_details(id,req.user.id); //id -> paramuser, secondparm -> CurrUser
        if (user===null){
            return res.status(404).json({error:`User with od:${id} not found.`})
        } else{
            //check if userId is following and make the data presentable
            //have to perform this across all functions that return whether a user is being followed or not 
            // user.isBeingFollowed= user.followers.length>0;
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
        console.log("getting followers of user: ",id);
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
        
        const followers = await get_following(id);
        res.status(200).json({followers});
    })
]
// bio, profilePicture, website github,
/*
- same as the create post 
- 
*/
exports.patchProfile = [

//MISSING username and displayname

    upload.single("attachment"),
    param("userId","invalid user id")
        .trim()
        .isNumeric(),
    body("username")
        .trim()
        .isLength({min:2,max:25})
        .withMessage("Username bettwen 2-25 characters")
        .matches(/^[a-zA-Z0-9_.]*$/)
        .withMessage("Username characters must be either alphanumeric, a period, or underscore"),

    body("displayname")
        .trim()
        .isLength({min:2,max:25})
        .withMessage("Displayname between 2-25 characters."),
    body("bio")
        // .optional()
        .trim()
        .isLength({max:350})
        .withMessage("max bio length is 350"),

    body("website") 
        .optional({nullable: true, checkFalsy: true})
        .trim()
        .isURL()
        .withMessage("website not valid url"),
    body("github")
        .optional({nullable: true, checkFalsy: true})
        .trim()
        .isURL()
        .withMessage("github not valid url"),
    validationHandle,

    asyncHandler(async(req,res,next)=>{

        //This is the only route we need the pfp_public_id so we should just retreive it 
        const user_profile = await prisma.profile.findUnique({
            where:{userId:req.user.id}
        })
        //
        console.log("??",req.body)
        const updateData = {}
        console.log("this is req.user now",req.user)
        
        if (req.file){
            console.log(req.file);
            const mimetype = req.file.mimetype.split("/")[0];
            if (mimetype!=='image'){
                throw new myError("Only image uploads allowed for profilPicture",400);
            }
            //upload new picture
            const result = await uploadStream(req.file.buffer,"bingus_pfp")
            console.log("======================new pfp status:",result)
            console.log("")
            //success upload, delete old pfp

            if (user_profile.pfp_public_id){ //Delete old profile picteu
                const deleted = await deleteFile(user_profile.pfp_public_id); //delete this
                console.log("======================old pfp status: ",deleted)
            }
            updateData.profilePicture = result.secure_url;
            updateData.pfp_public_id = result.public_id;
        }
        const mainData = {}

        //should try to find username first
        if (req.body.username!=req.user.username){
            const exist = await prisma.user.findUnique({where:{username:req.body.username}})
            if (exist) next(new myError('Username is already taken',400));

        }
        
         mainData.username=req.body.username;
        mainData.displayName=req.body.displayname;
        if (req.body.bio) updateData.bio = req.body.bio
        if (req.body.github) updateData.github=req.body.github
        if (req.body.website) updateData.website=req.body.website
        
        //BUG need to redo this. right now we are only updating user
        const user = await update_user(req.user.id,updateData,mainData);
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
        const settings = await prisma.userSetting.upsert({
            where:{userId:req.user.id},
            update:{
                isDarkMode
            },
            create:{
                isDarkMode,
                userId:req.user.id

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
            id:{
                followerId:req.user.id,
                followingId:Number(req.params.userId)
            }
        },
        create:{
            followerId:req.user.id,
            followingId:Number(req.params.userId)
        },
        update:{
            createdAt: new Date().toISOString()
        }

   })
   console.log("Result of follow",result)
   res.status(200).json({result})
})

exports.unfollowUser = asyncHandler(async(req,res,next)=>{
    const result = await prisma.follow.deleteMany({
        where:{
            followerId:req.user.id,
            followingId:Number(req.params.userId)
        }
   })
   console.log("Result of unfollow",result)
   res.status(200).json({result})
})