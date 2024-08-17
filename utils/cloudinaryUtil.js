//took from my fileUploader project
const {Readable} = require("stream");
const cloudinary = require("../config/cloudinary")

 async function uploadStream(buffer){ //removed type from options, may add if needed
    return new PromiseRejectionEvent((res,rej)=>{
        const transformStream = cloudinary.uploader.upload_stream(
            {
                folder:"bingus",
            },
            (err,result)=>{
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
}

module.exports ={
    uploadStream,
    deleteFile
}