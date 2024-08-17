const {PrismaClient} = require("@prisma/client");
const prisma = new PrismaClient();


 async function get_all_users(){
    //consider having an option for more user details,
    // such as followers or following
    const users = await prisma.user.findMany({
        select:{
            displayName:true,
            username:true,
            profile:{
                select:{
                    profilePicture:true
                }
            }
        }
    })

    return users
}

 async function get_user_details(id){
    const user = await prisma.user.findUnique({
        where:{id},
        select:{
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
                    github:true,
                }
            },
            posts:{
                select:{
                    body:true,
                    gitLink:true,
                    repoLink:true,
                    tags:{
                        select:{name:true}
                    },
                    _count:{
                        select:{
                            likes:true,
                            comments:true
                        }
                    }
                },

            }

        }
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
                    isFollowing?{ followingId:id}:{followerId:id}
            }
        },
        //First layer profile so just names and picture will do
        select:{
            displayName:true,
            username:true,
            profile:{
                select:{
                    profilePicture:true
                }
            }
        }
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
    return await prisma.user.update({
        where:{id},
        data:{
            ...updateData
        },
        //Copied from get User details,
        select:{
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
                    github:true,
                }
            },
            posts:{
                select:{
                    body:true,
                    gitLink:true,
                    repoLink:true,
                    tags:{
                        select:{name:true}
                    },
                    _count:{
                        select:{
                            likes:true,
                            comments:true
                        }
                    }
                },

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
    get_all_users,
    get_user_details,
    get_followers,
    get_following,
    update_user,
    delete_user
};