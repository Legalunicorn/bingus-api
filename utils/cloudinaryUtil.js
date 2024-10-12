//took from my fileUploader project
const {Readable} = require("stream");
const cloudinary = require("../config/cloudinary")

 async function uploadStream(buffer,folder,isVideo=false){ //removed type from options, may add if needed
    return new Promise((res,rej)=>{
        const transformStream = cloudinary.uploader.upload_stream(
            {
                folder,
                resource_type: 'auto'
            },
            (err,result)=>{
                // console.log("This is an error from cloudinary",err)
                if (err) return rej(err);
                res(result);
            } 
        );

        //Perform the upload
        let str = Readable.from(buffer); //
        str.pipe(transformStream)
    })
}

 async function deleteFile(public_id){
    
    result = await cloudinary.uploader.destroy(public_id)
    // console.log("DELTED:",result);
}

module.exports ={
    uploadStream,
    deleteFile
}