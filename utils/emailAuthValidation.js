const {PrismaClient} = require("@prisma/client")
const prisma = new PrismaClient();
const bcrypt = require("bcryptjs")
const myError = require("../lib/myError")


/*
-> username
-> email 
-> password
*/

export async function emailLoginValidation(email,password){
    try{
        const user = await prisma.user.findUnique({where:{email}});
        if (!user || !bcrypt.compareSync(password,user.hashedPassword)){
            throw new myError("Password or Email is incorrect",401);
        }
        return user;

        
    }catch(err){
        console.log("ERR: email login validation")
        console.log(err)
    }

}


//TODO change displayName to username 
export async function  emailSignupValidation(username,email,password){
    //make sure email is unique
    const exist = await prisma.user.findUnique({where:{email:email}})
    if (exist) throw new myError("Username has already been taken",409) //conflict
    else{
        try{
            const user = await prisma.user.create({
                data:{
                    username,
                    email,
                    password: encryptPassword(password)
                }
            })
            console.log("= New user created",user)
            return user;
        } catch(err){
            console.log("ERR: email signup validation")
            console.log(err)
        }

    }

}

function encryptPassword(password){
    const salt = bcrypt.genSaltSync(10); //random salt;
    const hash = bcrypt.hashSync(password,salt,null);
    return hash;
}