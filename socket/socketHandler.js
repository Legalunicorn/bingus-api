const {PrismaClient} = require("@prisma/client")
const prisma = new PrismaClient();

//Export socket handler into www.js 
module.exports = (io)=>{
    io.on("connection",(socket)=>{
        console.log("A user has connected. socket ID: ",socket.id)

        socket.on("join_DM",(chatId)=>{
            socket.join(chatId);
        });

        socket.on("send message",async({chatId,input,currUserId})=>{
            //sends a message 
            if (input){
                try{    
                    const message = await prisma.message.create({
                        data:{
                            content:input,
                            senderId:currUserId,
                            chatId
                        },
                    })

                    //emit the message to all users 
                    socket.to(chatId).emit("receive messsage",message)

                    await prisma.chat.update({ 
                        where:{id:chatId},
                        data:{lastMessageAt:new Date()}
                    })
                } catch(error){
                    //TODO deal with error , maybe emit it back
                    console.log("Error sending message",error);
                }
            }

        })

        socket.on("disconnect",()=>{
            console.log(socket.id," has disconnected.")
        })
    })
}