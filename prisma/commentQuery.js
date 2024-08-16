const {PrismaClient} = require("@prisma/client")
const prisma = new PrismaClient();

export async function create_comment(userId,body,parentCommentId){

    return await prisma.comment.create({
        data:{
            body,
            userId,
            ...(parentCommentId? parentCommentId: {})
        },
        select:{
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