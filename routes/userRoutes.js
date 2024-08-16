const router = require("express").Router();
const controller = require("../controllers/userController")
const ownAccountAuth = require("../middleware/ownAccountAuth")
const notAccountOwnerAuth = require("../middleware/notOwnerAccountAuth")


//GET - all the users 
router.get("/",
    controller.getAllUsers
)

// GET -information about a user
router.get("/:userId",
    controller.getUserDetails
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
router.patch("/:userId/profile",
    ownAccountAuth,
    controller.patchProfile
)

// PATH - update own settings |ownselfAuth
router.patch("/:userId/settings",
    ownAccountAuth,
    controller.patchSetting
)

// DELET - delete account  | ownselfAuth
router.delete("/:userId",
    ownAccountAuth,
    controller.deleteUser
)

// POST - follow new user
router.post("/:userId/follow",
    notAccountOwnerAuth,
    controller.followUser
)

// POST - unfollow user
router.post("/:userId/unfollow",
    notAccountOwnerAuth,
    controller.unfollowUser
)



module.exports = router;