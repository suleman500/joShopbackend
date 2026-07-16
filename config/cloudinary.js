const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');

// 1. تهيئة Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// 2. تهيئة Multer Storage باستخدام Cloudinary
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'products', // اسم المجلد في حساب Cloudinary
    allowed_formats: ['jpg', 'png', 'jpeg', 'webp'],
    // يمكنك إضافة تحويلات مثل:
    // transformation: [{ width: 500, height: 500, crop: 'limit' }]
  },
});

// 3. إنشاء middleware للرفع
const upload = multer({ storage: storage });

module.exports = { cloudinary, upload };