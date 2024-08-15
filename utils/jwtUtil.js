const jwt = require("jsonwebtoken")

export function generateToken(id){
    return jwt.sign({id},process.env.SECRET,{expiresIn:'5d'}) //TODO change expires after refresh token implemented
}