const {validationResult} = require("express-validator")

/**
 * Middleware that uses validationResult from express-validation 
 * to throw any detected errors
 * @returns undefined, its a middleware
 */
export default function validationHandle(req,res,next){
    const errors = validationResult(req);
    if (!errors.isEmpty()){
        return res.status(400).json({
            errors: errors.array()
        })
    }
    next();
}