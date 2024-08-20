const {PrismaClient} = require("@prisma/client")
const prisma = new PrismaClient();

 async function create_comment(commentData){

    return await prisma.comment.create({
        data:commentData,
        select:{
            id:true,
            body:true,
            createdAt:true,
            parentCommentId:true, //should be blank in result if none
            user:{
                select:{
                    id:true,
                    username:true,
                    profile:{
                        select:{
                            profilePicture:true
                        }
                    }
                }
            },
            _count:{
                select:{
                    likes:true
                }
            },
        }
    })

}

module.exports ={
    create_comment
}