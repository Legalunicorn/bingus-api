const expressAsyncHandler = require("express-async-handler");
const { all_posts, get_following_posts } = require("../prisma/queries/postQueries");
const { q_new_users,q_top_users} = require("../prisma/queries/userQueries")

exports.initGet = expressAsyncHandler(async(req,res,next)=>{
    const [new_post,new_follower_posts,new_users,top_users] = await Promise.all([
        all_posts(req.user.id), //TODO all posts need a parameter of the user ID 
        get_following_posts(req.user.id),
        q_new_users(req.user.id),
        q_top_users(req.user.id)
    ]);

    // console.log("sending-feed ",top_users);
    //count: followers:0

    res.status(200).json({new_post,new_follower_posts,new_users,top_users})
})

//all post -> INCLUDE_POST_FEEED
//get_user_details -> ... Selkect_user_detaield -> include_post_feed
/**
 * I want to check if a user follows another user
 * get a hashset of all the user followers
 * then modify q_new users and q_top users if they are in the hashset to be true or false
 */