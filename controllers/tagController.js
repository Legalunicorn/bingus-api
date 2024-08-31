const {PrismaClient} = require("@prisma/client");
const asyncHandler = require("express-async-handler");
const { get_tag_posts } = require("../prisma/queries/tagQueries");
const prisma = new PrismaClient();


//first verify that the tag is unique
exports.getTagPosts = asyncHandler(async(req,res,next)=>{ //DONE
    const tagId = Number(req.params.tagId);
    const exist = await prisma.tag.findUnique({
        where:{id:tagId}
    })
    if (!exist) return res.status(404).json({error:`Tag with id ${tagId} does not exist`})
    const posts = await get_tag_posts(tagId);
    return res.status(200).json({posts})
})