const {PrismaClient} = require("@prisma/client")
const prisma = new PrismaClient();
const bcrypt = require("bcryptjs")
const myError = require("../lib/myError")

 async function usernameLoginValidation(username,password){
    try{
        const user = await prisma.user.findUnique({where:{username}});
        if (!user || !bcrypt.compareSync(password,user.hashedPassword)){
            throw new myError("Password or Username is incorrect",401);
        }
        return user;

        
    }catch(err){
        console.log("ERR: username login validation")
        console.log(err)
    }

}


 async function  usernameSignupValidation(username,displayName,password){
    //make sure email is unique
    const exist = await prisma.user.findUnique({where:{username}})
    if (exist) throw new myError("Username has already been taken",409) //conflict
    else{
        try{
            const user = await prisma.user.create({
                data:{
                    username,
                    displayName,
                    password: encryptPassword(password)
                }
            })
            console.log("= New user created",user)
            return user;
        } catch(err){
            console.log("ERR: username signup validation")
            console.log(err)
        }

    }

}

function encryptPassword(password){
    const salt = bcrypt.genSaltSync(10); //random salt;
    const hash = bcrypt.hashSync(password,salt,null);
    return hash;
}

module.exports = {
    usernameLoginValidation,
    usernameSignupValidation
}