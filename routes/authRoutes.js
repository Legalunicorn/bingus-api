const router = require("express").Router();
const controller = require("../controllers/authController")
const hasAccount = require("../middleware/hasAccount")

//DEFINE API HERE

router.get('/oauth/google',controller.googleGet) 
router.get('/oauth/google/redirect',controller.googleRedirectGet)

router.patch("/oauth/username",
    hasAccount,
    controller.setUsername
)

router.post('/local/login',controller.loginPost)
router.post('/local/signup',controller.signupPost)



module.exports = router;