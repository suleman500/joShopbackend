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
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp', 'gif', 'bmp', 'tiff', 'svg'], // جميع الصيغ المدعومة
    transformation: [{ width: 800, height: 800, crop: 'limit' }], // تحسين الصور
  },
});

// بدون فلتر - يقبل كل الملفات
const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // حد 10 ميجابايت (اختياري)
});

module.exports = upload;