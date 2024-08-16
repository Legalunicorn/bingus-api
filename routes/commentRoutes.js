const router = require("express").Router();
const controller = require("../controllers/commentController")
const ownCommentAuth = require("../middleware/ownCommentAuth");
const requireAuth = require("../middleware/requireAuth");


//Getting all comments in post -> handled by post controller
//Getting all comments by user -> handled by user controller

router.delete("/:commentId", //What is the point of this?
    ownCommentAuth,
    controller.deleteComment
)

router.post("/",
    requireAuth,
    controller.postComment
)