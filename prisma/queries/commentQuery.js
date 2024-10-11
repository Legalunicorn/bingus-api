const {PrismaClient} = require("@prisma/client");
const { SELECT_USER_BASIC } = require("./querySnippets");
const prisma = new PrismaClient();


async function get_child_comments(id,currUserId,myCursor){
    return await prisma.comment.findMany({

        take:5, 
        where:{
            parentCommentId:id,
        },
        select:{
            id:true,
            body:true,
            createdAt:true,
            parentCommentId:true,
            _count:{
                select:{
                    likes:true
                }
            },
            user:{
                select: SELECT_USER_BASIC
            },
            likes:{
                where:{userId:currUserId}
            },
            
        },
        orderBy:{
            createdAt:'asc'
        },
       ...( myCursor && {
        cursor:{id:myCursor},
        skip:1
    })

    })
}


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
    create_comment,
    get_child_comments
}