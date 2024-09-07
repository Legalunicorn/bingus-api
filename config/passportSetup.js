
const passport = require("passport")
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const {PrismaClient} = require("@prisma/client")
const prisma = new PrismaClient();

// I want to Enforce unique usernames
// if its a new google account -> redirect to frontend to create a username first
passport.use(
        new GoogleStrategy({
        callbackURL:`${process.env.API_URL}/api/auth/oauth/google/redirect`,
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET
        },
        
        async(accessToken,refreshToken,profile,done)=>{
            try{
            //for now we ignore the access and refresh token
                console.log(profile); //profile.photos[0].value

                const googleId = profile.id;
                const displayName = profile.displayName
                const email = profile.emails[0].value;
                const googleExist = await  prisma.user.findUnique({
                    where:{googleId},
                    include:{
                        profile:{
                            select:{profilePicture:true}//README added this so frontend does not need to fetch again
                            //README alternatively, i thought of making the app header do its own fetch to fetch for user information
                        }
                    }
                })

                if (googleExist) return done(null,googleExist) //Registered google user

                const emailExist = await prisma.user.findUnique({where:{email}})
                //BUG email is no longer a required valid field
                //Thus if we done have email this will not exist
                // but if we allow users to store their email then yeah this will be a problem
                // and we still need this step
                if (emailExist){ 
                    //We override and give access to email registered account
                    //Because this has unintended consequences, we should varify email
                    const updatedUser = await prisma.user.update({ //dont update their profilepicture or do..?
                        //if we update their pfp we can be sure to have one
                        where:{email},
                        data:{googleId},
                        include:{
                            profile:{
                                select:{profilePicture:true}
                            }
                        }
                    }) //verdict: we dont update. 
                    return done(null,updatedUser)
                }

                //Completely new user
                const username = 'user'+ new Date().valueOf();

                const newUser = await prisma.user.create({
                //Set randompassword for new users
                    data:{
                        setUsername:false, //redirect them to set user name page
                        displayName,
                        email,
                        googleId,
                        username, //Default username
                        profile:{
                            create:{
                                profilePicture:profile.photos[0].value
                            }
                        }
                    }
                })//will get handled in callback

                return done(null,newUser)

            } catch(err){
                console.log("GOOGLE STAT ERR:")
                return done(err)
            }
        }
    )
)

module.exports = passport