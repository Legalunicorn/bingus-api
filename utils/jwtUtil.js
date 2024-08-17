const jwt = require("jsonwebtoken")

export function generateToken(id,expiresIn='5d'){
    //default expire in 5day
    return jwt.sign({id},process.env.SECRET,{expiresIn}) //TODO change expires after refresh token implemented
}