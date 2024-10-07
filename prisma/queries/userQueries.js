const {PrismaClient} = require("@prisma/client");
const prisma = new PrismaClient();
const {SELECT_USER_BASIC,SELECT_ISUSER_FOLLOWING,SELECT_USER_DETAILED, SELECT_USER_WITH_FOLLOW} = require("./querySnippets")
const myError = require( "../../lib/myError");


async function get_user_basic(id){ //TODO check if this was ever used
    return await prisma.user.findUnique({
        where:{id},
        select:{
            id:true,
            username:true,
            displayName:true,
            profile:{
                select:{
                    profilePicture:true
                }
            }
        }
    })
}

 async function get_all_users(currUser,search){ //README  deleete this if not used
    //consider having an option for more user details,
    // such as followers or following
    return await prisma.user.findMany({
        select:SELECT_USER_WITH_FOLLOW(currUser),
        where: search? {
            OR:[
                {
                    username:{contains:search}
                },
                {
                    displayName:{contains:search}
                }
            ]
        }:undefined

    })
}

 async function get_user_details(id,currUserId){
    return  await prisma.user.findUnique({
        where:{id},
        select:SELECT_USER_DETAILED(currUserId)
    })
}
/**
 * Helper function , to get either following or followers
 * @param {*} isFollowing Whether we are looking for followings or following
 * @param {*} id 
 */
async function followingOrfollowers(isFollowing,id){
    const res = await prisma.user.findMany({
        where:{
            following:{
                some:
                    isFollowing?{ followerId:id}:{followingId:id}
            }
        },
        //First layer profile so just names and picture will do
        select:SELECT_USER_BASIC
    })
    return res;
}


 async function get_followers(id){
    return await followingOrfollowers(false,id);
}

 async function get_following(id){
    return await followingOrfollowers(true,id);
}

async function update_user(id,profileData,userData){

    return await prisma.user.update({
        where:{id},
        data:{
            ...userData,
            profile:{
                update:{
                    ...profileData
                }
            }
        },
        include:{
            profile:{
                select:{
                    profilePicture:true
                }
            }
        }

        
    })
}

 async function delete_user(id){
    return await prisma.user.delete({
        where:{
            id
        }
    })
}

//TODO EXCLUDE uerId
async function q_new_users(userId){
    const data = await prisma.user.findMany({
        select:SELECT_USER_WITH_FOLLOW(userId),
        take:3,
        where:{
            id:{
                not:userId
            }
        },
        orderBy:{
            createdAt:'desc'
        }
    })
    return data;


}
//TODO EXCLUDE USERID
async function q_top_users(userId){
    return await prisma.user.findMany({
        select:SELECT_USER_WITH_FOLLOW(userId),
        take:3,
        where:{
            id:{
                not:userId
            }
        },
        orderBy:{
            followers:{
                _count:'desc'
            }
        }
    })
}


//IDEA, maybe i should seperate json queries that are used commonly into their own variables

module.exports = {
    get_user_basic,
    get_all_users,
    get_user_details,
    get_followers,
    get_following,
    update_user,
    delete_user,
    q_new_users,
    q_top_users
};