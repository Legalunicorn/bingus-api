const {PrismaClient} = require("@prisma/client");
const prisma = new PrismaClient();


//README display information about a user
const SELECT_USER_BASIC = {
    id:true,
    username:true,
    displayName:true,
    profile:{
        select:{
            profilePicture:true
        }
    }
}

//README a detailed user profile
const SELECT_USER_DETAILED = {
    id:true,
    displayName:true,
    username:true,
    createdAt:true,
    _count:{
        select:{
            followers:true,
            following:true
        }
    },
    profile:{
        select:{
            website:true,
            profilePicture:true,
            github:true
        }
    },
    posts:{
        select:{
            body:true,
            gitLink:true,
            repoLink:true,
            tags:{
                select:{
                    name:true
                }
            },
            _count:{
                select:{
                    likes:true,
                    comments:true
                }
            }
        }
    }
}

async function get_user_basic(id){
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

 async function get_all_users(){
    //consider having an option for more user details,
    // such as followers or following
    return await prisma.user.findMany({
        select:SELECT_USER_BASIC
    })
}

 async function get_user_details(id){
    return  await prisma.user.findUnique({
        where:{id},
        select:SELECT_USER_DETAILED
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

 async function update_user(id,updateData){
    console.log("UD ID",id)
    return await prisma.profile.upsert({
        where:{userId:id},
        update:updateData,
        create:{
            ...updateData,
            userId:id
        },
        select:{
            user:{
                select:SELECT_USER_DETAILED
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


//IDEA, maybe i should seperate json queries that are used commonly into their own variables

module.exports = {
    get_user_basic,
    get_all_users,
    get_user_details,
    get_followers,
    get_following,
    update_user,
    delete_user
};