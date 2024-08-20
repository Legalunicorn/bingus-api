const router = require("express").Router();
const controller = require("../controllers/commentController");
const commentExist = require("../middleware/commentExist");
const ownCommentAuth = require("../middleware/ownCommentAuth");
const requireAuth = require("../middleware/requireAuth");
// const 


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

router.post("/:commentId/like",
    requireAuth,
    commentExist,
    controller.postCommentLike
)

router.post("/:commentId/unlike",
    requireAuth,
    commentExist,
    controller.postCommentUnlike
)

router.delete("/:commentId",
    requireAuth,
    commentExist,
    controller.deleteComment
)

module.exports = router