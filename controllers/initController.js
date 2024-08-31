const expressAsyncHandler = require("express-async-handler");
const { all_posts, get_following_posts } = require("../prisma/postQueries");
const { q_new_users,q_top_users} = require("../prisma/userQueries")

exports.initGet = expressAsyncHandler(async(req,res,next)=>{
    const [new_post,new_follower_posts,new_users,top_users] = await Promise.all([
        all_posts(),
        get_following_posts(req.user.id),
        q_new_users(),
        q_top_users()
    ]);

    res.status(200).json({new_post,new_follower_posts,new_users,top_users})
})