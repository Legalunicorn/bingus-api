/**
 * =================== USER SNIPPETS ====================
 */

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
//README pass in userID to see if retrived users is followed by userId
 function SELECT_USER_WITH_FOLLOW (userId) {
    
    item = 
    {
        ...SELECT_USER_BASIC,
        // _count:{
        //         select:{
        //             followers:{
        //                 where:{followerId:userId}
        //                 }
        //             }
        //         }
        
        followers:{
            where:{
                followerId:userId
            }
        }
        
    }
    return item;
}

//README a detailed user profile, need data whether youre following or not
function SELECT_USER_DETAILED (currUserId){ //THis needs a second param for
    return {
    id:true,
    displayName:true,
    username:true,
    createdAt:true,
    //README Logic to check if currUserId is following x user
    followers:{
        where:{
            followerId:currUserId
        }
    },
    _count:{
        select:{
            followers:true,
            following:true,
            posts:true
        }
    },
    profile:{
        select:{
            website:true,
            profilePicture:true,
            github:true,
            bio:true,
        }
    },
    posts:{
        include:INCLUDE_FEED_POST(currUserId),
        orderBy:{createdAt:'desc'}
    }
    }
}


/**
 * POSTS QUERIES
 */



//README basic  about posts for the feed 
function INCLUDE_FEED_POST(userId){
    return{
        _count:{
            select:{
                likes:true,
                comments:true,
            }
        },
        tags:{
            select:{name:true}
        },
        author:{
            select:SELECT_USER_BASIC
        },
        likes:{ //relation 
            where:{
                userId:userId
            }
        }
    }
}

//README information about a focused post (ie, comments and everything)
function INCLUDE_SINGLE_POST(currUserId){
    return{
    _count:{
        select:{
            likes:true,
            comments:true,
        }
    },
    likes:{
        where:{
            userId:currUserId
        }
    },
    tags:{
        select:{
            name:true
        }
    },
    author:{
        select:SELECT_USER_BASIC
    },
    comments:{
        where:{parentCommentId:null},
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
                select:SELECT_USER_BASIC
            },
            likes:{ //Field to indicate whether current user has liked comment
                where:{
                    userId:currUserId
                }
            },
            
            //TODO comment this entire section out
            childComment:{
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
                        select:SELECT_USER_BASIC
                    }
                },
                orderBy:{
                    createdAt:'asc'
                }
            }
        },
        orderBy:{
            createdAt:'desc'
        }
    }
    }
}

module.exports={
    SELECT_USER_BASIC,
    SELECT_USER_DETAILED,
    SELECT_USER_WITH_FOLLOW,
    INCLUDE_FEED_POST,
    INCLUDE_SINGLE_POST
}