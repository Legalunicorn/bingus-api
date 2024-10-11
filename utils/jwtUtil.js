const jwt = require("jsonwebtoken")

function generateToken(id,expiresIn='3d'){
    //default expire in 5day
    return jwt.sign({id},process.env.SECRET,{expiresIn}) //TODO change expires after refresh token implemented
}

module.exports = {generateToken}