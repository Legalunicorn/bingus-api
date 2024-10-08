const express = require("express")
const router = express.Router();

const authRoutes = require("./authRoutes")
const postRoutes = require("./postRoutes")
const userRoutes = require("./userRoutes")
const tagRoutes = require("./tagRoutes")
const commentRoutes = require("./commentRoutes")
const initRoutes = require("./initRoutes")
const chatRoutes = require("./chatRouter")



router.use("/auth",authRoutes) //DONE
router.use("/posts",postRoutes) //DONE
router.use("/users",userRoutes) //DONE
router.use("/tags",tagRoutes) //DONE
router.use("/comments",commentRoutes)
router.use("/init",initRoutes)
router.use("/chats",chatRoutes)


module.exports = router

//app.js will append "/api" to all routes