
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
                    where:{googleId}
                })

                if (googleExist) return done(null,googleExist) //Registered google user

                const emailExist = await prisma.user.findUnique({where:{email}})
                if (emailExist){ 
                    //We override and give access to email registered account
                    const updatedUser = await prisma.user.update({
                        where:{email},
                        data:{googleId}
                    })
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
                        username,
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