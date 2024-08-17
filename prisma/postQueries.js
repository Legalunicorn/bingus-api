const {PrismaClient} = require("@prisma/client");
const prisma = new PrismaClient();

 async function all_posts(){
    const posts = await prisma.post.findMany({ 
        include:{//bug change this to select 
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
                select:{
                    username:true,
                    profile:{
                        select:{
                            profilePicture:true,
                        }
                    }
                }
            }
        },
        orderBy:{
            createdAt:'desc'
        }
    })
    return posts;
}

 async function user_posts(id){
    const posts = await prisma.post.findMany({ 
        include:{ //not sure what this is
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
                select:{
                    displayName:true,
                    username:true,
                    profile:{
                        select:{
                            profilePicture:true,
                        }
                    }
                }
            }
        },
        where:{
            user:{id}
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
        include:{
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
            //BUG, this will select all child comment as main comment as well!
            comments:{
                where:{parentCommentId:null},
                select:{//==
                    body:true,
                    createdAt:true,
                    _count:{
                        select:{
                            likes:true
                        }
                    },
                    user:{
                        select:{
                            id:true,
                            username:true,
                            profile:{
                                select:{
                                    profilePicture:true,
                                }
                            },
                        }
                    },
                    childComment:{
                        select:{
                            body:true,
                            createdAt:true,
                            parentCommentId:true,
                            _count:{
                                select:{
                                    likes:true
                                }
                            },
                            user:{
                                select:{
                                    displayName: true,
                                    profile:{
                                        select:{
                                            profilePicture:true
                                        }
                                    }
                                }
                            }
                        }
                    }
                }//==
            }
        }
    })
    return post;
}

 async function get_following_posts(userId){
    const posts = await prisma.post.findMany({
        //the author of the post is being followed by x user Id
        where:{
            author:{
                followers:{
                    some:{
                        followerId:userId
                    }
                }
            }
        },
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
                select:{
                    displayName,
                    profile:{
                        select:{
                            profilePicture:true,
                        }
                    }
                }
            }
        },
        orderBy:{
            createdAt:'desc'
        }
    })

    return posts
}

 async function create_post(body,userId,tags){

    const post = await prisma.post.create({
        data:{
            body,
            userId,
            //spread operatr takes the priperties and spread to the parent object
            ...(tags && {
                tags:{
                    connect: tags.map(tag=>{tag.id})
                }
            })
        },
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
                select:{
                    displayName,
                    profile:{
                        select:{
                            profilePicture:true,
                        }
                    }
                }
            }
        }
    })

    return post
}

 async function delete_post(id){
    const post = await prisma.post.delete({
        where:{
            id
        }
    })
    return post;
}

 async function update_post(id,postData,tags){
    //should try to set tags regardless
    const post = await prisma.post.update({
        where:{
            id
        },
        data:{
            ...postData,
            tags:{
                set: tags.map(tag=>({id:tag.id}))
            }
        },
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
                select:{
                    displayName,
                    profile:{
                        select:{
                            profilePicture:true,
                        }
                    }
                }
            }
        }
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