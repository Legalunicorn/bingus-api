const asyncHandler = require("express-async-handler")
const passport = require("../config/passportSetup")
const { generateToken } = require("../utils/jwtUtil")
const {validationHandle} = require("../middleware/validationHandle")
const {body} = require("express-validator")
const myError = require("../lib/myError")
const {PrismaClient} = require("@prisma/client")
const prisma = new PrismaClient();
const { usernameSignupValidation, usernameLoginValidation } = require("../utils/usernameAuthValidation")


exports.googleGet = (req,res,next)=>{
    const authenticator = passport.authenticate('google',{
        scope:['profile','email']
    })
    authenticator(req,res,next);
}

exports.googleRedirectGet = [
    //Call passport.authenticate again but this time it has user
    passport.authenticate('google',{session:false}),
    (req,res,next)=>{
        const user = req.user; //README user now has profilepicture access 
        if (!user.setUsername){
            const token = generateToken(user.id,'10min') //
            return res.redirect(`${process.env.CLIENT_URL}/auth/oauth/setusername?token=${token}`)
        }

        //Already registered Gooogle account with username
        const token = generateToken(user.id);
        // console.log("====== google redirect registered =====")
        res.redirect(`${process.env.CLIENT_URL}/auth/login?token=${token}&username=${user.username}&id=${user.id}&profilePicture=${user.profile.profilePicture}`)
        
    }
]


exports.setUsername = [
    body("username")
        .trim()
        .isLength({min:2,max:25})
        .withMessage("Username betwen 2-35 characters")
        .matches(/^[a-zA-Z0-9_.]*$/),


    validationHandle,

    asyncHandler(async(req,res,next)=>{

        
        const {username} = req.body;
        const id = req.user.id;
        // console.log("modify id ",id)
        const [existId,existUser] = await Promise.all([ //check for pre-existing usernames
            prisma.user.findUnique({where:{id}}),
            prisma.user.findUnique({where:{username}})
        ])

        if (!existId) res.status(404).json({error:`user ${id} does not exist`})
        if (existUser) {
            if (existUser.id==id) throw new myError("Username must be different",400)
            else                  throw new myError("Username already exists",409);
        }
        // Success
        const user = await prisma.user.update({ //Update the username value;b
            where:{id},
            data:{
                username,
                setUsername:true
            },
            include:{
                profile:{
                    select:{profilePicture:true}
                }
            }

        })
        const token = generateToken(user.id);
        res.status(200).json({
            token,
            username,
            id: user.id,
            profilePicture:user.profile.profilePicture
        })
    })

]

// auth/local/login
exports.loginPost = [
    body("username","Invalid username")
        .trim(),
    body("password")
        .trim()
        .isLength({min:3})
        .withMessage("Password must be at least 3 characters long"),

    // validationHandle,
    

    asyncHandler(async(req,res,next)=>{
        const {username,password} = req.body;
        const user = await usernameLoginValidation(username,password)
        const token = generateToken(user.id);

        //Check if the user has a profile picture
        res.status(200).json({
            token,
            username: user.username,
            id: user.id,//README changed
            profilePicture:user.profile.profilePicture
        })
    })
]

//auth/local/signup
exports.signupPost=[
    body("displayName","Invalid display name")
        .trim()
        .isLength({min:2,max:25}), //updated maxlength fro m35 to 25 due to UI constraints
    body("username")
        .trim()
        .isLength({min:2,max:25})
        .withMessage("Username betwen 2-35 characters")
        .matches(/^[a-zA-Z0-9_.]*$/)
        .withMessage("Username characters must be either alphanumeric, a period, or underscore"),
    body("password")
        .trim()
        .isLength({min:3})
        .withMessage("Password must be at least 3 characters long"),
    body("confirm_password","Confirm pass failed")
        .trim()
        .custom((value, {req}) => value === req.body.password).withMessage("The passwords do not match"),        

    validationHandle,

    asyncHandler(async(req,res,next)=>{
        const {username,displayName,password} = req.body;
        const user = await usernameSignupValidation(username,displayName,password)
        const token = generateToken(user.id)
        res.status(200).json({
            token,
            username,
            id:user.id,
            profilePicture:null //new users have no profilepicture //README Changed
        })
    })


]