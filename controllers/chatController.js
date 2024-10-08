const asyncHandler = require("express-async-handler")
const {PrismaClient} = require("@prisma/client");
const { get_user_chats, get_chat_messages } = require("../prisma/queries/chatQueries");
const prisma = new PrismaClient();

//import as you need

exports.getChats = asyncHandler(async(req,res,next)=>{
    const userChats = await get_user_chats(req.user.id);

    const chats = userChats.map(chat=>({
        id:chat.id,
        otherUser: chat.userAId===req.user.id? chat.userB:chat.userA,
        lastMessageAt: chat.lastMessageAt

    }))

    console.log("chat list is :",chats)

    res.status(200).json({chats});
})

exports.getDM = asyncHandler(async(req,res,next)=>{
    const chatId = Number(req.params.chatId);

    const chatHistory = await get_chat_messages(chatId);
    //Have userA and userB 
    //how to process?
    //we dont need, we just need the id of the users to process properly and its good enough 
    const messages = chatHistory.map(msg=>{
        return {
            ...msg,
            fromUser: senderId===req.user.id
            
        }
    })

    res.status(200).json({messages})
})