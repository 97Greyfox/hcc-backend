const cloudinary = require('cloudinary').v2;
const fs = require('fs');
require('dotenv').config();


cloudinary.config({ 
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
    api_key: process.env.CLOUDINARY_API_KEY, 
    api_secret: process.env.CLOUDINARY_SECRET_KEY, 
});

module.exports = cloudinary;


// const uploadOnCloudinary = async (localFilePath)=>{
//   try {
//     if(!localFilePath) return null
    
//     const response = await v2.uploader.upload(localFilePath, {
//       resource_type:"image"
//     });

//     console.log("file uploaded on cloudinary", response.url);
//     fs.unlinkSync(localFilePath);
//     return response;

//   } catch (error) {
//     fs.unlinkSync(localFilePath);
//     return null;
//   }
// }

// module.exports = {uploadOnCloudinary}
    
  
   
