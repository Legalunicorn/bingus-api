const {PrismaClient} = require("@prisma/client")
const prisma = new PrismaClient();
const uid = 13
const update = async()=>{
    const updatedUser = await prisma.user.update({
        where:{
            id:uid
        },
        data:{
            profile:{
                create:{
                    profilePicture:"https://res.cloudinary.com/ds80ayjp7/image/upload/v1725690182/bingus_pfp_bzezbh.png",
                }
            }
        }
    })
    console.log(updatedUser);

}


update();
