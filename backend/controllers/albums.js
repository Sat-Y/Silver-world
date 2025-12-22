const fs = require("node:fs");
const path = require("node:path");
const multer = require("multer");

// Define storage paths
const albumsDir = path.join(__dirname, "../database/albums");
// 使用绝对路径来确保文件被上传到正确的目录
// 注意：__dirname 是 E:\随便整的一些事\zyh-world\example\Mizuki-master\Mizuki-master\backend\controllers
const projectRoot = path.resolve(__dirname, ".."); // 获取项目根目录，即 backend 目录
const uploadsDir = path.join(projectRoot, "../public/uploads"); // 使用绝对路径配置上传目录

// 添加日志调试
console.log("=== 上传目录配置 ===");
console.log("当前文件目录:", __dirname);
console.log("项目根目录:", projectRoot);
console.log("上传目录:", uploadsDir);
console.log("=== 上传目录配置结束 ===");

// Create directories if they don't exist
if (!fs.existsSync(albumsDir)) {
	fs.mkdirSync(albumsDir, { recursive: true });
}

if (!fs.existsSync(uploadsDir)) {
	fs.mkdirSync(uploadsDir, { recursive: true });
}

// Multer storage configuration for photo uploads
const storage = multer.diskStorage({
	destination: (_req, _filee, cb) => {
		cb(null, uploadsDir);
	},
	filename: (_req, file, cb) => {
		const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
		cb(
			null,
			`${file.fieldname}-${uniqueSuffix}${path.extname(file.originalname)}`,
		);
	},
});

// File filter for images
const fileFilter = (_req, file, cb) => {
	const allowedTypes = /jpeg|jpg|png|gif|webp|svg/;
	const extname = allowedTypes.test(
		path.extname(file.originalname).toLowerCase(),
	);
	const mimetype = allowedTypes.test(file.mimetype);

	if (mimetype && extname) {
		return cb(null, true);
	}
	cb(new Error("Only image files are allowed!"));
};

// Multer upload instance
const upload = multer({
	storage: storage,
	limits: {
		fileSize: Number.parseInt(process.env.MAX_FILE_SIZE || "5242880", 10), // 5MB default
	},
	fileFilter: fileFilter,
});

/**
 * Get all albums
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Promise<Object>} JSON response
 */
exports.getAlbums = async (_req, res) => {
	try {
		// Read all album files
		const files = fs.readdirSync(albumsDir);
		const albums = [];

		for (const file of files) {
			if (file.endsWith(".json")) {
				const filePath = path.join(albumsDir, file);
				const fileContent = fs.readFileSync(filePath, "utf8");
				const album = JSON.parse(fileContent);
				albums.push(album);
			}
		}

		// Sort albums by created date (newest first)
		albums.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

		res.status(200).json({
			success: true,
			data: albums,
			total: albums.length,
		});
	} catch (error) {
		console.error("Get albums error:", error);
		res.status(500).json({
			success: false,
			message: "Internal server error",
		});
	}
};

/**
 * Get a single album by ID
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Promise<Object>} JSON response
 */
exports.getAlbumById = async (req, res) => {
	try {
		const { id } = req.params;
		const filePath = path.join(albumsDir, `${id}.json`);

		if (!fs.existsSync(filePath)) {
			return res.status(404).json({
				success: false,
				message: "Album not found",
			});
		}

		const fileContent = fs.readFileSync(filePath, "utf8");
		const album = JSON.parse(fileContent);

		res.status(200).json({
			success: true,
			data: album,
		});
	} catch (error) {
		console.error("Get album by id error:", error);
		res.status(500).json({
			success: false,
			message: "Internal server error",
		});
	}
};

/**
 * Create a new album
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Promise<Object>} JSON response
 */
exports.createAlbum = async (req, res) => {
	try {
		const { title, description, date, location, tags } = req.body;

		// Validate required fields
		if (!title) {
			return res.status(400).json({
				success: false,
				message: "Please provide album title",
			});
		}

		// Create new album object
		const newAlbum = {
			id: Date.now().toString(),
			title,
			description: description || "",
			date: date || new Date().toISOString().split("T")[0],
			location: location || "",
			tags: tags || [],
			photos: [],
			createdAt: new Date().toISOString(),
			updatedAt: new Date().toISOString(),
		};

		// Write album to file
		const filePath = path.join(albumsDir, `${newAlbum.id}.json`);
		fs.writeFileSync(filePath, JSON.stringify(newAlbum, null, 2), "utf8");

		res.status(201).json({
			success: true,
			message: "Album created successfully",
			data: newAlbum,
		});
	} catch (error) {
		console.error("Create album error:", error);
		res.status(500).json({
			success: false,
			message: "Internal server error",
		});
	}
};

/**
 * Update an existing album with support for file uploads
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Promise<Object>} JSON response
 */
exports.updateAlbum = async (req, res) => {
	try {
		const { id } = req.params;
		const filePath = path.join(albumsDir, `${id}.json`);

		if (!fs.existsSync(filePath)) {
			return res.status(404).json({
				success: false,
				message: "Album not found",
			});
		}

		// Read existing album
		const fileContent = fs.readFileSync(filePath, "utf8");
		const album = JSON.parse(fileContent);

		// Parse form data
		const { title, description, location, date, tags, photosToDelete } = req.body;
		
		// Update album basic info
		album.title = title || album.title;
		album.description = description || album.description;
		album.location = location || album.location;
		album.date = date || album.date;
		album.tags = tags ? JSON.parse(tags) : album.tags;
		album.updatedAt = new Date().toISOString();

		// Handle cover image upload
		if (req.files && req.files.cover && req.files.cover[0]) {
			const coverFile = req.files.cover[0];
			
			// Delete old cover if it exists (only if it's not the default placeholder)
			if (album.photos.length > 0) {
				const oldCoverPath = path.join(uploadsDir, path.basename(album.photos[0].url));
				if (fs.existsSync(oldCoverPath)) {
					fs.unlinkSync(oldCoverPath);
				}
				// Remove old cover from photos array
				album.photos.shift();
			}
			
			// Add new cover as first photo
			const newCover = {
				id: `${Date.now()}-${Math.round(Math.random() * 1e9)}`,
				url: `/uploads/${coverFile.filename}`,
				filename: coverFile.filename,
				originalName: coverFile.originalname,
				size: coverFile.size,
				mimetype: coverFile.mimetype,
				uploadedAt: new Date().toISOString(),
			};
			album.photos.unshift(newCover);
		}

		// Handle new photos upload
		if (req.files && req.files.photos && req.files.photos.length > 0) {
			const uploadedPhotos = req.files.photos.map(file => ({
				id: `${Date.now()}-${Math.round(Math.random() * 1e9)}`,
				url: `/uploads/${file.filename}`,
				filename: file.filename,
				originalName: file.originalname,
				size: file.size,
				mimetype: file.mimetype,
				uploadedAt: new Date().toISOString(),
			}));
			album.photos = [...album.photos, ...uploadedPhotos];
		}

		// Handle photos deletion
		if (photosToDelete) {
			const photosToDeleteArray = JSON.parse(photosToDelete);
			
			// Delete photos from filesystem and remove from album
			for (const photoId of photosToDeleteArray) {
				const photoIndex = album.photos.findIndex(photo => photo.id === photoId);
				if (photoIndex !== -1) {
					const photo = album.photos[photoIndex];
					const photoPath = path.join(uploadsDir, path.basename(photo.url));
					if (fs.existsSync(photoPath)) {
						fs.unlinkSync(photoPath);
					}
					album.photos.splice(photoIndex, 1);
				}
			}
		}

		// Write updated album to file
		fs.writeFileSync(filePath, JSON.stringify(album, null, 2), "utf8");

		res.status(200).json({
			success: true,
			message: "Album updated successfully",
			data: album,
		});
	} catch (error) {
		console.error("Update album error:", error);
		res.status(500).json({
			success: false,
			message: error.message || "Internal server error",
		});
	}
};

/**
 * Delete an album
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Promise<Object>} JSON response
 */
exports.deleteAlbum = async (req, res) => {
	try {
		const { id } = req.params;
		const filePath = path.join(albumsDir, `${id}.json`);

		if (!fs.existsSync(filePath)) {
			return res.status(404).json({
				success: false,
				message: "Album not found",
			});
		}

		// Read album data to delete associated photos
		const fileContent = fs.readFileSync(filePath, "utf8");
		const album = JSON.parse(fileContent);

		// Delete associated photos from filesystem
		for (const photo of album.photos) {
			const photoPath = path.join(uploadsDir, path.basename(photo.url));
			if (fs.existsSync(photoPath)) {
				fs.unlinkSync(photoPath);
			}
		}

		// Delete album file
		fs.unlinkSync(filePath);

		res.status(200).json({
			success: true,
			message: "Album and associated photos deleted successfully",
		});
	} catch (error) {
		console.error("Delete album error:", error);
		res.status(500).json({
			success: false,
			message: "Internal server error",
		});
	}
};

/**
 * Upload photos to an album
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Promise<Object>} JSON response
 */
exports.uploadPhotos = async (req, res) => {
	try {
		const { id } = req.params;
		const filePath = path.join(albumsDir, `${id}.json`);

		if (!fs.existsSync(filePath)) {
			return res.status(404).json({
				success: false,
				message: "Album not found",
			});
		}

		// Read existing album
		const fileContent = fs.readFileSync(filePath, "utf8");
		const album = JSON.parse(fileContent);

		// Process uploaded files
		const uploadedPhotos = [];
		if (req.files && Array.isArray(req.files)) {
			for (const file of req.files) {
				const photo = {
					id: `${Date.now()}-${Math.round(Math.random() * 1e9)}`,
					url: `/uploads/${file.filename}`,
					filename: file.filename,
					originalName: file.originalname,
					size: file.size,
					mimetype: file.mimetype,
					uploadedAt: new Date().toISOString(),
				};
				uploadedPhotos.push(photo);
			}
		}

		// Add new photos to album
		album.photos = [...album.photos, ...uploadedPhotos];
		album.updatedAt = new Date().toISOString();

		// Write updated album to file
		fs.writeFileSync(filePath, JSON.stringify(album, null, 2), "utf8");

		res.status(200).json({
			success: true,
			message: `${uploadedPhotos.length} photos uploaded successfully`,
			data: {
				album,
				uploadedPhotos,
			},
		});
	} catch (error) {
		console.error("Upload photos error:", error);
		res.status(500).json({
			success: false,
			message: error.message || "Internal server error",
		});
	}
};

/**
 * Delete a photo from an album
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Promise<Object>} JSON response
 */
exports.deletePhoto = async (req, res) => {
	try {
		const { id, photoId } = req.params;
		const filePath = path.join(albumsDir, `${id}.json`);

		if (!fs.existsSync(filePath)) {
			return res.status(404).json({
				success: false,
				message: "Album not found",
			});
		}

		// Read existing album
		const fileContent = fs.readFileSync(filePath, "utf8");
		const album = JSON.parse(fileContent);

		// Find photo to delete
		const photoIndex = album.photos.findIndex((photo) => photo.id === photoId);
		if (photoIndex === -1) {
			return res.status(404).json({
				success: false,
				message: "Photo not found in album",
			});
		}

		const photo = album.photos[photoIndex];

		// Delete photo file from filesystem
		const photoPath = path.join(uploadsDir, path.basename(photo.url));
		if (fs.existsSync(photoPath)) {
			fs.unlinkSync(photoPath);
		}

		// Remove photo from album
		album.photos.splice(photoIndex, 1);
		album.updatedAt = new Date().toISOString();

		// Write updated album to file
		fs.writeFileSync(filePath, JSON.stringify(album, null, 2), "utf8");

		res.status(200).json({
			success: true,
			message: "Photo deleted successfully",
			data: album,
		});
	} catch (error) {
		console.error("Delete photo error:", error);
		res.status(500).json({
			success: false,
			message: "Internal server error",
		});
	}
};
