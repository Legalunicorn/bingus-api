const {PrismaClient} = require("@prisma/client");
const prisma = new PrismaClient();

export async function all_posts(){
    const posts = await prisma.post.findMany({ //TODO narrow down the selects
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

export async function user_posts(id){
    const posts = await prisma.post.findMany({ //TODO narrow down the selects
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


//TODO, include all child comments as comments too!
export async function get_post(id){ //TODO confirm if this shit works
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

export async function get_following_posts(userId){
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

export async function create_post(body,userId,tags){

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

export async function delete_post(id){
    const post = await prisma.post.delete({
        where:{
            id
        }
    })
    return post;
}

export async function update_post(id,postData,tags){
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