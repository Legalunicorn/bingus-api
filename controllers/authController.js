const asyncHandler = require("express-asyc-handler")
// const passport = require("passport")
const passport = require("../config/passportSetup")
const { generateToken } = require("../utils/jwtUtil")
const { default: validationHandle } = require("../middleware/validationHandle")
const {body} = require("express-validator")
const { emailLoginValidation, emailSignupValidation } = require("../utils/emailAuthValidation")
const myError = require("../lib/myError")
const {PrismaClient} = require("@prisma/client")
const prisma = new PrismaClient();
const jwt = require("js")


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
        if (!user.username){
            //TODO jwt token send must be temporary token that dies fast
            const token = generateToken(user.id,'10min') //
            return res.redirect(`${process.env.CLIENT_URL}/auth/set-username?token=${token}`)
            //username form to point back to different endpoint
        }
        //Already registered Gooogle account with username
        const token = generateToken(user.id);
        console.log("====== google redirect registered =====")
        res.redirect(`${process.env.CLIENT_URl}?token=${token}%username=${user.username}`)
        
    }
]
exports.setUsername = [
    body("username")
        .trim()
        .isLength({min:2,max:35})
        .withMessage("Username betwen 2-35 characters")
        .matches(/^[a-ZA-Z0-9_.]*$/),
    body("id")
        .isInt(),

    validationHandle,

    asyncHandler(async(req,res,next)=>{
        
        const {username,id} = req.body;
        if (req.user.id!==id){
            throw new myError("OAuth cannot set username. Id mismatch.",401);
        }
        const [existId,existUser] = await Promise.all([ //check for pre-existing usernames
            prisma.user.findUnique({where:{id}}),
            prisma.user.findUnique({where:{username}})
        ])

        if (!existId) res.status(404).json({error:`user ${id} does not exist`})
        if (existUser) {
            if (existUser.id==id) throw new Error("Username must be different",400)
            else                  throw new myError("Username already exists",409);
        }
        // Success
        const user = await prisma.user.update({ //Update the username value;b
            where:{id},
            data:{username}
        })
        const token = generateToken(user.id);
        res.status(200).json({
            token,
            username
        })
    })

]


exports.loginPost = [
    body("username","Invalid email")
        .trim(),
    body("password")
        .trim()
        .isLength({min:2,max:35})
        .withMessage("Password must be between 2-35 characters long"),

    validationHandle,

    asyncHandler(async(req,res,next)=>{
        const {username,password} = req.body;
        const user = await g(email,username); //BUG change to username validatoin
        const token = generateToken(user.id);
        res.status(200).json({
            token,
            username: user.username
        })
    })
]

exports.signupPost=[
    body("email","Invalid email")
        .trim()
        .isEmail(),
    body("username")
        .trim()
        .isLength({min:2,max:35})
        .withMessage("Username betwen 2-35 characters")
        .matches(/^[a-ZA-Z0-9_.]*$/)
        .withMessage("Username characters must be either alphanumeric, a period, or underscore"),
    body("password")
        .trim()
        .isLength({min:2,max:35})
        .withMessage("Password must be between 2-35 characters long"),

    validationHandle,

    asyncHandler(async(req,res,next)=>{
        const {username,email,password} = req.body;
        const user = await emailSignupValidation(username,email,password)
        const token = generateToken(user.id)
        res.status(200).json({
            token,
            username
        })
    })


]