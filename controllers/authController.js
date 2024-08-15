const asyncHandler = require("express-asyc-handler")
const passport = require("passport")
const { generateToken } = require("../utils/jwtUtil")
const { default: validationHandle } = require("../middleware/validationHandle")
const { emailLoginValidation, emailSignupValidation } = require("../utils/emailAuthValidation")


exports.googleGet = (req,res,next)=>{
    const authenticator = passport.authenticate('google',{
        scope:['profile','email']
    })
    authenticator(req,res,next);
}

exports.googleRedirectGet = (req,res,next)=>[
    //Call passport.authenticate again but this time it has user
    passport.authenticate('google',{session:false}),
    (req,res,next)=>{
        const user = req.user;
        const token = generateToken(user.id);
        console.log("====== google redirect =====")
        //have to hardcode a redirect url
        res.redirect(`${process.env.CLIENT_URl}?token=${token}%displayName=${user.displayName}`)
        
    }
]


exports.loginPost = [
    body("email","Invalid email")
        .trim()
        .isEmail(),
    body("password")
        .trim()
        .isLength({min:2,max:35})
        .withMessage("Password must be between 2-35 characters long"),

    validationHandle,

    asyncHandler(async(req,res,next)=>{
        const {email,password} = req.body;
        const user = await emailLoginValidation(email,password);
        const token = generateToken(user.id);
        res.status(200).json({
            token,
            displayName
        })
    })
]

exports.signupPost=[
    body("email","Invalid email")
        .trim()
        .isEmail(),
    body("displayName")
        .trim()
        .isLength({min:2,max:35})
        .withMessage("Displayname betwen 2-35 characters")
        .matches(/^[a-ZA-Z0-9_. ']*$/)
        .withMessage("DisplayName characters must be either alphanumeric, a period, space, or underscore"),
    body("password")
        .trim()
        .isLength({min:2,max:35})
        .withMessage("Password must be between 2-35 characters long"),

    validationHandle,

    asyncHandler(async(req,res,next)=>{
        const {displayName,email,password} = req.body;
        const user = await emailSignupValidation(displayName,email,password)
        const token = generateToken(user.id)
        res.status(200).json({
            token,
            displayName
        })
    })


]