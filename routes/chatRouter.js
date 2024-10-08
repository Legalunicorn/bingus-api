const router = require("express").Router();
const requireAuth = require("../middleware/requireAuth")
const controller = require("../controllers/chatController")

//  /api/chats/getChats

router.get("/",
    requireAuth,
    controller.getChats
) //getchats
// router.post("/") //create a new chat between two user

router.get("/:chatId",
    requireAuth,
    controller.getDM
)


// // Not important
// router.delete("/:chatId") //delete records between two users


module.exports = router