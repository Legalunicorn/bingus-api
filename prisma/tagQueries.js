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