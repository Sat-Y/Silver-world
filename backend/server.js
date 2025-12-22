const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("node:path");
const cookieParser = require("cookie-parser");

// Load environment variables
dotenv.config();

// Initialize express app
const app = express();

// Middleware configuration
app.use(
	cors({
		origin: ["http://localhost:3000", "http://localhost:3001"],
		credentials: true,
	}),
);

// Cookie parser middleware
app.use(cookieParser());

// 支持尾部斜杠
app.use((req, _res, next) => {
	if (req.path.endsWith("/") && req.path.length > 1) {
		// 直接修改请求路径，而不是重定向，这样对于POST请求也能生效
		req.url = req.url.slice(0, -1);
		req.path = req.path.slice(0, -1);
	}
	next();
});

app.use(express.json({ limit: "5mb" }));
app.use(express.urlencoded({ extended: true, limit: "5mb" }));

// Static file serving - 使用绝对路径确保一致性
const projectRoot = path.resolve(__dirname, ".."); // 获取项目根目录

// 主要静态文件目录 - public/uploads
app.use(
	"/uploads",
	express.static(
		path.join(projectRoot, "public/uploads"), // 使用绝对路径配置主要静态文件目录
	),
);

// 保留其他静态文件目录配置，以确保向后兼容
app.use(
	"/uploads",
	express.static(path.join(projectRoot, "frontend/public/uploads")),
);

// 保留 backend/public/uploads 目录作为后备，确保现有相册的图片能正常显示
app.use("/uploads", express.static(path.join(__dirname, "public/uploads")));

// Routes
const authRoutes = require("./routes/auth");
const postRoutes = require("./routes/posts");
const albumRoutes = require("./routes/albums");

// API Routes - Add charset=utf-8 to all JSON responses
app.use((req, res, next) => {
  const originalJson = res.json;
  res.json = function(data) {
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    return originalJson.call(this, data);
  };
  next();
});

app.use("/api/auth", authRoutes);
app.use("/api/admin/posts", postRoutes);
app.use("/api/admin/albums", albumRoutes);
// Public routes for frontend access to albums
app.use("/api/albums", albumRoutes);
// Public routes for frontend access to posts
app.use("/api/posts", postRoutes);
app.use("/api/articles", postRoutes); // Alias for backward compatibility with frontend code

// Health check route
app.get("/api/health", (_req, res) => {
	res.status(200).json({ success: true, message: "Backend API is running" });
});

// Handle 404 errors
app.use((_req, res, next) => {
	res.status(404).json({ success: false, message: "Route not found" });
	next();
});

// Global error handler
app.use((err, _req, res, next) => {
	console.error("Error:", err);
	res.status(500).json({
		success: false,
		message:
			process.env.NODE_ENV === "development"
				? err.message
				: "Internal server error",
	});
	next(err);
});

// Create upload directory if it doesn't exist
const fs = require("node:fs");
const uploadDir = path.join(
	__dirname,
	"../public/uploads", // 强制使用正确的上传目录
);
if (!fs.existsSync(uploadDir)) {
	fs.mkdirSync(uploadDir, { recursive: true });
	console.log(`Created upload directory: ${uploadDir}`);
}

// Start server
const PORT = process.env.PORT || 3001;

// Initialize default admin user when server starts
const { initDefaultAdmin } = require("./controllers/auth");
initDefaultAdmin();

app.listen(PORT, () => {
	console.log(`Backend server running on http://localhost:${PORT}`);
	console.log(`API routes available at http://localhost:${PORT}/api`);
});

module.exports = app;
