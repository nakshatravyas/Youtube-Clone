import { v2 as cloudinary } from 'cloudinary';
import fs from "fs"

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const uploadOnCloudinary = async (localFilePath) => {
    try {
        if (!localFilePath) return null
        //upload the file on cloud
        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: 'auto'
        })
        //file has been uploaded successfull
        // console.log("file is uploaded on cloud ", response.url)
        fs.unlinkSync(localFilePath);//delete file from temp server
        return response;
    }
    catch (error) {
        fs.unlinkSync(localFilePath); //delete local file if upload is failed
        return null;
    }
}

export { uploadOnCloudinary };

