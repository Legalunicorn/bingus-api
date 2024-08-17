const router = require("express").Router();
const controller = require("../controllers/postController")
const requireAuth = require("../middleware/requireAuth")
const ownPostAuth = require("../middleware/ownPostAuth")

//Get all POST by recency, OPTIONAL: user
router.get("/:userId?",controller.getManyPosts)

// GET a single POST, for everyone 
router.get("/:postId",controller.getPost)

// GET a post by users who userId is followingo
router.get("/following",
    requireAuth,
    controller.getFollowingPosts
)
// POST a new post
router.post("/",
    requireAuth,
    controller.createPost
)

// DELETE a post
router.delete("/:postId",
    ownPostAuth,
    controller.deletePost
)

router.patch("/:postId/link",
    ownPostAuth,
    controller.patchPostLink
)

// UPDATE a post
router.patch(":/postId",
    ownPostAuth,
    controller.updatePost
)
 
router.post(":/postId/like",
    requireAuth,
    controller.likePost
    
)
router.post(":/postId/unlike",
    requireAuth,
    controller.unlikePost
)  


module.exports = router;