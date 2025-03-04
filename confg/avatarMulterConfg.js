const multer = require('multer');
const path = require('path');
const {CloudinaryStorage} = require('multer-storage-cloudinary');
const cloudinary = require('./cloudinaryConfig');


const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'uploads', 
    allowed_formats: ['jpg', 'png', 'jpeg'], 
    public_id: (req, file) => `${Date.now()}-${file.originalname}`,
  },
});


// const fileFilter = (req, file, cb) => {
//   const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
//   if (allowedTypes.includes(file.mimetype)) {
//     cb(null, true);
//   } else {
//     cb(new Error('Invalid file type. Only JPEG, PNG, and GIF are allowed.'), false);
//   }
// };


const uploads = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, 
}).single('avatar'); 

module.exports = {uploads};
