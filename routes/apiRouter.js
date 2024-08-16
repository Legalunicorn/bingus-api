const express = require("express")
const router = express.Router();

const authRoutes = require("./authRoutes")
const postRoutes = require("./postRoutes")
const userRoutes = require("./userRoutes")



router.use("/auth",authRoutes)
router.use("/posts",postRoutes)
router.use("/users",userRoutes)
//Apply all the main routes
//then export to app.js


module.exports = router

//app.js will append "/api" to all routes