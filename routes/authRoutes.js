const router = require("express").Router();
const controller = require("../controllers/authController")

//DEFINE API HERE

router.get('/google',controller.googleGet) //TODO implement this after local implementation
router.get('/google/redirect',controller.googleRedirectGet)
router.post('/local/login',controller.loginPost)
router.post('/local/signup',controller.signupPost)



module.exports = router;