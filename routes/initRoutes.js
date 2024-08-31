/**
 * When the user loads the app, this is the main api
 */

const router = require("express").Router();
const controller = require("../controllers/initController")
const requireAuth = require("../middleware/requireAuth")

router.get("/",
    requireAuth,
    controller.initGet
)

module.exports = router