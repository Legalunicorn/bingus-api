const router = require("express").Router();
const controller = require("../controllers/userController")
const ownAccountAuth = require("../middleware/ownAccountAuth")
const notAccountOwnerAuth = require("../middleware/notOwnerAccountAuth");
const requireAuth = require("../middleware/requireAuth");


//GET - all the users -> inputs id
router.get("/", //DONE
    requireAuth,
    controller.getAllUsers
)

// GET -information about a user
router.get("/:userId", //DONE
    requireAuth,
    controller.getUserDetails
)

router.get("/self/:userId",
    ownAccountAuth,
    controller.getUserDetails //same endpoint but different security
)



// GET - get followers of user
router.get("/:userId/followers",
    controller.getFollowers
)

// GET - get user's following
router.get("/:userId/following",
    controller.getFollowing
)

// PATCH - update own profile | ownselfAuth
router.patch("/:userId/profile", //DONE
    ownAccountAuth,
    controller.patchProfile
)

// PATH - update own settings |ownselfAuth
router.patch("/:userId/settings", //DONE
    ownAccountAuth,
    controller.patchSetting
)

// DELET - delete account  | ownselfAuth
router.delete("/:userId", //DONE
    ownAccountAuth,
    controller.deleteUser
)

// POST - follow new user
router.post("/:userId/follow", //DONE
    notAccountOwnerAuth,
    controller.followUser
)

// POST - unfollow user
router.post("/:userId/unfollow", //DONE
    notAccountOwnerAuth,
    controller.unfollowUser
)



module.exports = router;