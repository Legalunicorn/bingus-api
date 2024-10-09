const {PrismaClient} = require("@prisma/client");
const { SELECT_USER_BASIC } = require("./querySnippets");
const prisma = new PrismaClient();


async function get_user_chats(currUserId){
    return await prisma.chat.findMany({
        where:{
            OR:[
                {userAId:currUserId},
                {userBId:currUserId}
            ]
        },
        include:{
            userA:{select:SELECT_USER_BASIC},
            userB:{select:SELECT_USER_BASIC}
        },
        orderBy:{lastMessageAt:'desc'}
    })
}

async function get_chat_messages(chatId){
    return await prisma.message.findMany({
        where:{chatId},
        orderBy:{createdAt:'asc'}, //double check asc or desc
        //take:50 -> load recent 50 messages? 
    })
}

module.exports = {
    get_user_chats,
    get_chat_messages
}