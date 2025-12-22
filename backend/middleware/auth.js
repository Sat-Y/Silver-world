const { verifyToken } = require("../utils/auth");

/**
 * Authentication middleware to protect API routes
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
exports.protect = async (req, res, next) => {
	try {
		let token;

		// Check if token is in headers
		if (req.headers.authorization?.startsWith("Bearer")) {
			token = req.headers.authorization.split(" ")[1];
		}

		// Check if token is in cookies
		if (!token && req.cookies && req.cookies.token) {
			token = req.cookies.token;
		}

		if (!token) {
			return res.status(401).json({
				success: false,
				message: "Not authorized to access this route",
			});
		}

		// Verify token
		const decoded = verifyToken(token);

		if (!decoded) {
			return res.status(401).json({
				success: false,
				message: "Invalid or expired token",
			});
		}

		// Attach user to request object
		req.user = {
			id: decoded.id,
			username: decoded.username,
			email: decoded.email,
		};

		next();
	} catch (error) {
		console.error("Auth middleware error:", error);
		return res.status(401).json({
			success: false,
			message: "Not authorized to access this route",
		});
	}
};

/**
 * Admin role middleware to restrict access to admin users
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
exports.admin = async (req, res, next) => {
	try {
		// For now, we'll just check if user is authenticated
		// In a real app, we'd check for admin role in the database
		if (!req.user) {
			return res.status(401).json({
				success: false,
				message: "Not authorized to access this route",
			});
		}

		next();
	} catch (error) {
		console.error("Admin middleware error:", error);
		return res.status(500).json({
			success: false,
			message: "Internal server error",
		});
	}
};
