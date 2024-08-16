const {PrismaClient} = require("@prisma/client")
const prisma = new PrismaClient();



export async function upsert_tags(tags){
    const upsertTags = await Promise.all(tags.map(name=>{
        prisma.tag.upsert({
            data:{
                name
            }
        })
    }))
    return upsertTags

}

export async function get_tag_posts(id){
    return await prisma.post.findMany({
        where:{
            tags:{
                some:{
                    id //matches the tagid im looking for
                }
            }
        },
        include:{//bug change this to select 
            _count:{
                select:{
                    likes:true,
                    comments:true,
                }
            },
            tags:{
                select:{
                    id:true,
                    name:true
                }
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
}

//many to manyfunction