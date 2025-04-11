import { v2 as cloudinary } from 'cloudinary';

 import dotenv from 'dotenv'
 dotenv.config({
     path:'./env'
 });

import fs from 'fs'

cloudinary.config({ 
    cloud_name:process.env.CLOUDINARY_CLOUD_NAME ,
    api_key:   process.env.CLOUDINARY_CLOUD_API_KEY ,
    api_secret:process.env.CLOUDINARY_CLOUD_API_SECRET,
});

const uploadOnCloudinary =  async (localFilepath)=>{

    try {
        
        if(!localFilepath) return null;
        //upload on cloudinary

        const response =   await  cloudinary.uploader.upload(localFilepath,{
            resource_type:"auto"
        })
        // uploaded successfully
        console.log("File uploaded successfully on cloudinary",response.url);

        return response
        


    } catch (error) {
        fs.unlinkSync(localFilepath) //remove the locally saved temp file as the upload operation got failed
        return null;
    }

}

export {uploadOnCloudinary}