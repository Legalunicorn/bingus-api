const asyncHandler = require("express-async-handler")
const {PrismaClient} = require("@prisma/client");
const { get_user_chats, get_chat_messages } = require("../prisma/queries/chatQueries");
const prisma = new PrismaClient();
const myError = require("../lib/myError")

//import as you need

exports.getChats = asyncHandler(async(req,res,next)=>{
    const userChats = await get_user_chats(req.user.id);

    const chats = userChats.map(chat=>({
        id:chat.id,
        otherUser: chat.userAId===req.user.id? chat.userB:chat.userA,
        lastMessageAt: chat.lastMessageAt,
        lastMessage: chat.lastMessage


    }))

    console.log("chat list is :",chats)

    res.status(200).json({chats});
})

exports.getDM = asyncHandler(async(req,res,next)=>{
    const chatId = Number(req.params.chatId);

    //First check that chat exist and make sure req.user is a memeber of this chat 
    const exist = await prisma.chat.findUnique({where:{id:chatId}});
    if (!exist) return res.status(404).json({error:"No such chat"});
    if (exist.userAId!==req.user.id && exist.userBId!==req.user.id){
        return res.status(400).json({error:`User is not a memeber of chat ${chatId}`});
    }

    const otherUserId = req.user.id===exist.userAId? exist.userBId:exist.userAId;

    // const chatHistory = await get_chat_messages(chatId);

    const [chatHistory,otherUser] = await Promise.all([
        get_chat_messages(chatId),
        prisma.user.findUnique({
            where:{id:otherUserId},
            select:{
                username:true
            }
        })
    ])
    console.log("chat hist========",chatHistory)
    //TODO get the username of the other user
    const messages = chatHistory.map(msg=>{
        return {
            ...msg,
            fromUser: msg.senderId===req.user.id
            
        }
    })
    console.log(messages)

    res.status(200).json({messages,otherUser})
})

exports.putChat = asyncHandler(async(req,res,next)=>{
    //1. get the opposing user using the id
    const userId = Number(req.params.userId);
    const currUserId = req.user.id;
    if (userId==currUserId){
        throw new myError("Cannot create chat with self",400);
    }

    const existUser = await prisma.user.findUnique({where:{id:userId}})
    if (!existUser){
        throw new myError("User does not exist",400)
    }

    //user A as the smaller Id 
    const smaller = userId<currUserId? userId: currUserId;
    const bigger =  userId<currUserId? currUserId: userId;

    const chat  = await prisma.chat.upsert({
        where:{
            userAId_userBId:{
                userAId:smaller,
                userBId:bigger
            }
        },
        update:{},
        create:{
            userAId:smaller,
            userBId:bigger
        }
    })

    res.status(200).json({chat})


    //1. check that user with id exist
    //2. check that user id != req.user.id 
    //3. create or return said chat 
    // give back the id 
})