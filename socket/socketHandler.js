const {PrismaClient} = require("@prisma/client")
const prisma = new PrismaClient();

//Export socket handler into www.js 
module.exports = (io)=>{
    io.on("connection",(socket)=>{
        console.log("A user has connected. socket ID: ",socket.id)

        socket.on("join_DM",(chatId)=>{
            console.log("Chat ID joined: ",chatId)
            socket.join(chatId);
        });

        socket.on("send message",async({chatId,input,senderId})=>{
            console.log("=======messsage is sending===========")
            //sends a message 
            if (input){
                try{    
                    const message = await prisma.message.create({
                        data:{
                            content:input,
                            senderId,
                            chatId:Number(chatId)
                        },
                    })

                    //emit the message to all users
                    const data = {...message,fromUser:false}; //cannot send message to ownself
                    console.log("data is: ",data)
                    socket.broadcast.to(chatId).emit("receive message",data)

                    await prisma.chat.update({ 
                        where:{id:Number(chatId)},
                        data:{
                            lastMessageAt:new Date(),
                            lastMessage: input
                        }
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