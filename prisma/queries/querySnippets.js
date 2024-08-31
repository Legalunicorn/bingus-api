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
    
    item = {
        ...SELECT_USER_BASIC,
        _count:{
        select:{
            followers:{
                where:{
                    followerId:userId
                }
            }
        }
    }}
    return item;
}

//README a detailed user profile, need data whether youre following or not
function SELECT_USER_DETAILED (userId){
    return {
    id:true,
    displayName:true,
    username:true,
    createdAt:true,
    followers:{
        where:{
            followerId: (userId)
        }
    },
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
}


/**
 * POSTS QUERIES
 */



//README basic  about posts for the feed 
const INCLUDE_FEED_POST = {
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
    }
}

//README information about a focused post (ie, comments and everything)
const INCLUDE_SINGLE_POST ={
    _count:{
        select:{
            likes:true,
            comments:true,
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

module.exports={
    SELECT_USER_BASIC,
    SELECT_USER_DETAILED,
    SELECT_USER_WITH_FOLLOW,
    INCLUDE_FEED_POST,
    INCLUDE_SINGLE_POST
}