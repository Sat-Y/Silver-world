const express = require("express");
const multer = require("multer");
const path = require("path");
const marked = require("marked");
const {
	getPosts,
	deletePost,
	uploadPost,
	getPostById,
	updatePost
} = require("../controllers/posts");
const { protect, admin } = require("../middleware/auth");

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
	destination: (req, file, cb) => {
		// Use a temporary directory for uploaded files
		cb(null, path.join(__dirname, "../tmp"));
	},
	filename: (req, file, cb) => {
		// Generate unique filename, preserve original filename encoding
		const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
		// Ensure proper encoding for filenames
		const safeFilename = Buffer.from(file.originalname, 'utf8').toString('utf8');
		cb(null, "markdown-" + uniqueSuffix + path.extname(safeFilename));
	}
});

// File filter - only allow .md files
const fileFilter = (req, file, cb) => {
	const extname = path.extname(file.originalname).toLowerCase();
	if (extname === ".md") {
		return cb(null, true);
	}
	cb(null, false); // 使用false而不是抛出错误，这样可以在控制器中处理
};

const upload = multer({
	storage,
	fileFilter,
	limits: {
		fileSize: 1024 * 1024 * 5 // 5MB limit
	}
});

// Create tmp directory if it doesn't exist
const fs = require("fs");
const tmpDir = path.join(__dirname, "../tmp");
if (!fs.existsSync(tmpDir)) {
	fs.mkdirSync(tmpDir, { recursive: true });
}

// Public routes - no authentication required
// Get all published posts
router.get("/", getPosts);

// Define the path to store posts - use frontend content/posts directory
const postsDir = path.join(__dirname, "../../frontend/src/content/posts");

// Get single post by ID
router.get("/:id", getPostById);

// Upload route - protected
router.post("/upload", protect, admin, upload.single("markdown"), uploadPost);

// Delete post route - protected
router.delete("/:id", protect, admin, deletePost);

// Update post route - protected
router.put("/:id", protect, admin, updatePost);

module.exports = router;
