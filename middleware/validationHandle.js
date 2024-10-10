const {validationResult} = require("express-validator")

/**
 * Middleware that uses validationResult from express-validation 
 * to throw any detected errors
 * @returns undefined, its a middleware
 */
function validationHandle(req,res,next){
    const errors = validationResult(req);
    if (!errors.isEmpty()){
        const errorMessages = errors.array().map(err=>err.msg)
        // console.log("aiai",errors);
        return res.status(400).json({
            error: errorMessages
        })
    }
    next();
}

module.exports = {validationHandle}