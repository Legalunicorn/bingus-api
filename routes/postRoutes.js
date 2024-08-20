const router = require("express").Router();
const controller = require("../controllers/postController")
const requireAuth = require("../middleware/requireAuth")
const ownPostAuth = require("../middleware/ownPostAuth")

//Get all POST by recency, OPTIONAL: user 
router.get("/",controller.getManyPosts) //DONE

// GET a single POST with comments data
router.get("/single/:postId",controller.getPost) //DONE

// GET a post by users who userId is following
router.get("/following", //DONE
    requireAuth,
    controller.getFollowingPosts
)
// POST a new post
router.post("/", //DONE
    requireAuth,
    controller.createPost
)

// DELETE a post
router.delete("/:postId", //DONE
    ownPostAuth,
    controller.deletePost
)

router.patch("/:postId/link", //DONE
    ownPostAuth,
    controller.patchPostLink
)

// UPDATE a post
router.patch("/:postId", //DONE
    ownPostAuth,
    controller.updatePost
)
 
router.post("/:postId/like", //DONE
    requireAuth,
    controller.likePost
    
)
router.post("/:postId/unlike", //DONE
    requireAuth,
    controller.unlikePost
)  


module.exports = router;