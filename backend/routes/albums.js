const express = require("express");
const multer = require("multer");
const {
	getAlbums,
	getAlbumById,
	createAlbum,
	updateAlbum,
	deleteAlbum,
	uploadPhotos,
	deletePhoto,
} = require("../controllers/albums");
const { protect, admin } = require("../middleware/auth");

const router = express.Router();

// Multer storage configuration for photo uploads - same as in albums controller
const path = require("node:path");
const fs = require("node:fs");

const projectRoot = path.resolve(__dirname, "..");
const uploadsDir = path.join(projectRoot, "../public/uploads");

// Create uploads directory if it doesn't exist
if (!fs.existsSync(uploadsDir)) {
	fs.mkdirSync(uploadsDir, { recursive: true });
}

// File filter for images
const fileFilter = (_req, file, cb) => {
	const allowedTypes = /jpeg|jpg|png|gif|webp|svg/;
	const extname = allowedTypes.test(
		path.extname(file.originalname).toLowerCase()
	);
	const mimetype = allowedTypes.test(file.mimetype);

	if (mimetype && extname) {
		return cb(null, true);
	}
	cb(new Error("Only image files are allowed!"));
};

// Multer storage configuration
const storage = multer.diskStorage({
	destination: (_req, _filee, cb) => {
		cb(null, uploadsDir);
	},
	filename: (_req, file, cb) => {
		const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
		cb(
			null,
			`${file.fieldname}-${uniqueSuffix}${path.extname(file.originalname)}`
		);
	},
});

// Multer upload instance that handles both cover and photos
const upload = multer({
	storage: storage,
	limits: {
		fileSize: Number.parseInt(process.env.MAX_FILE_SIZE || "5242880", 10), // 5MB default
	},
	fileFilter: fileFilter,
});

// Public routes for frontend access
router.route("/").get(getAlbums);
router.route("/:id").get(getAlbumById);

// Protected routes for admin users
router.route("/").post(protect, admin, createAlbum);

// Update album route with file upload support
router
	.route("/:id")
	.put(protect, admin, upload.fields([{ name: 'cover', maxCount: 1 }, { name: 'photos', maxCount: 20 }]), updateAlbum)
	.delete(protect, admin, deleteAlbum);

// Photo management routes
router.route("/:id/photos").post(protect, admin, upload.array("photos", 20), uploadPhotos);

router.route("/:id/photos/:photoId").delete(protect, admin, deletePhoto);

module.exports = router;
