const router = require("express").Router();
const controller = require("../controllers/tagController");
const requireAuth = require("../middleware/requireAuth");

router.use(requireAuth)
router.get("/:tagId/posts",
    controller.getTagPosts
)

module.exports = router