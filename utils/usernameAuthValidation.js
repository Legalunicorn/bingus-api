const {PrismaClient} = require("@prisma/client")
const prisma = new PrismaClient();
const bcrypt = require("bcryptjs")
const myError = require("../lib/myError")

 async function usernameLoginValidation(username,password){
        const user = await prisma.user.findUnique({where:{username}});
        if (!user || !bcrypt.compareSync(password,user.hashedPassword)){
            throw new myError("Password or Username is incorrect",401);
        }
        return user;


}


 async function  usernameSignupValidation(username,displayName,password){
    //make sure username is unique
    const exist = await prisma.user.findUnique({where:{username}})
    console.log("Signup EXIST: ",exist);
    if (exist) throw new myError("Username has already been taken",409) //conflict
    const user = await prisma.user.create({
        data:{
            username,
            displayName,
            hashedPassword: encryptPassword(password)
        }
    })
    console.log("= New user created",user)
    return user;

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