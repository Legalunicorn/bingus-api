const {PrismaClient} = require("@prisma/client");
const prisma = new PrismaClient();
const { SELECT_USER_BASIC,INCLUDE_FEED_POST,INCLUDE_SINGLE_POST } = require("./querySnippets");


//TODO figure out for ech post, if the user has liked the post before or not


 async function all_posts(){
    const posts = await prisma.post.findMany({ 
        include:INCLUDE_FEED_POST
        ,
        orderBy:{
            createdAt:'desc'
        }
    })
    return posts;
}

 async function user_posts(id){
    const posts = await prisma.post.findMany({ 
        include:INCLUDE_FEED_POST,
        where:{
            userId:id
        },
        orderBy:{
            createdAt:'desc'
        }
    })
    return posts;
}


 async function get_post(id){ 
    const post = await prisma.post.findUnique({
        where:{
            id
        },
        include:INCLUDE_SINGLE_POST
    })
    return post;
}

 async function get_following_posts(userId){
    console.log(userId)
    
    const posts = await prisma.post.findMany({
        //the author of the post is being followed by x user Id
        where:{ //find a post
            author:{ //where the POSTER of the post
                followers:{
                    some:{
                        followerId:userId
                    }
                }
            }
        },
        include:INCLUDE_FEED_POST,
        orderBy:{
            createdAt:'desc'
        }
    })
    // console.log("posts are",posts)

    return posts
}


async function create_post(reqData){
    return await prisma.post.create({
        data:reqData,
        include:{
            _count:{
                select:{
                    likes:true,
                    comments:true
                }
            },
            tags:{
                select:{name:true}
            },
            author:{
                select:SELECT_USER_BASIC
            }

        }
    })
}

 async function delete_post(id){
    const post = await prisma.post.delete({
        where:{id},
        include:INCLUDE_FEED_POST
    })
    return post;
}



async function update_post(id,postData){
    return await prisma.$transaction(async(tx)=>{
        if (postData.tags){ //If we are to update tags, we delete all exiting relations
            await tx.post.update({
                where:{id},
                data:{
                    tags:{
                        set:[]
                    }
                }
            })
        }

        const post = await tx.post.update({
            where:{id},
            data:{
                ...postData,
            },
            include:INCLUDE_FEED_POST
        })

        return post;
    })
}



module.exports = {
    all_posts,
    user_posts,
    get_post,
    get_following_posts,
    create_post,
    delete_post,
    update_post
};

//READ ME these are the st