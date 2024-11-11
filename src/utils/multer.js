import multer from "multer";
import path from "path";
import cloudinary from "../config/cloudinary.js";

const storage = multer.memoryStorage();

const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }, 
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    }
    cb(new Error("Only images are allowed"));
  },
});

const uploadToCloudinary = (file) => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload_stream(
      {
        resource_type: "auto", 
        folder: "healer/uploads", 
        public_id: Date.now() + path.parse(file.originalname).name, 
        transformation: [{ width: 500, height: 500, crop: "limit" }], 
      },
      (error, result) => {
        if (error) {
          return reject(error);
        }
        resolve(result); 
      }
    ).end(file.buffer);
  });
};

/**
 * Middleware to handle image upload to Cloudinary
 * 
 * @param {string} field - The field name where the image is expected (e.g., 'image')
 * @returns {Array} - An array of middlewares for handling the image upload
 * result will be on req.imageUrl
 */
const uploadImage = (field) => {
    return [
        upload.single(field), 
        async (req, res, next) => {
          try {
            if (req.file) {
              const result = await uploadToCloudinary(req.file);
              req.imageUrl = result.secure_url;
            }

            next();
          } catch (error) {
            console.error("Error uploading to Cloudinary:", error);
            return res.status(500).json({ message: "Image upload failed, please try again later." });
          }
        },
      ];
}

export default uploadImage;
