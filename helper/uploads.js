const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('cloudinary').v2;

// تكوين Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// تكوين التخزين على Cloudinary
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'products', // اسم المجلد في Cloudinary
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp', 'gif'],
    transformation: [{ width: 800, height: 800, crop: 'limit' }], // تحسين الصور
  },
});

// فلتر الملفات (اختياري)
const fileFilter = (req, file, cb) => {
  // قبول الصور فقط
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('يرجى رفع صورة فقط'), false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // حد 5 ميجابايت
});

module.exports = upload;