const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

/**
 * Generate JWT token for user authentication
 * @param {Object} user - User object containing id, username, email
 * @returns {string} JWT token
 */
exports.generateToken = (user) => {
	const payload = {
		id: user.id,
		username: user.username,
		email: user.email,
	};

	return jwt.sign(payload, process.env.JWT_SECRET, {
		expiresIn: process.env.JWT_EXPIRES_IN || "7d",
	});
};

/**
 * Verify JWT token
 * @param {string} token - JWT token to verify
 * @returns {Object|null} Decoded payload if valid, null otherwise
 */
exports.verifyToken = (token) => {
	try {
		return jwt.verify(token, process.env.JWT_SECRET);
	} catch (error) {
		console.error("Token verification error:", error.message);
		return null;
	}
};

/**
 * Hash password using bcrypt
 * @param {string} password - Plain text password
 * @returns {Promise<string>} Hashed password
 */
exports.hashPassword = async (password) => {
	const salt = await bcrypt.genSalt(10);
	return bcrypt.hash(password, salt);
};

/**
 * Compare password with hash
 * @param {string} password - Plain text password
 * @param {string} hash - Hashed password
 * @returns {Promise<boolean>} True if password matches, false otherwise
 */
exports.comparePassword = async (password, hash) => {
	return bcrypt.compare(password, hash);
};

/**
 * Create default admin user if none exists
 * @param {Object} db - Database instance
 * @returns {Promise<void>}
 */
exports.createDefaultAdmin = async (_db) => {
	// This will be implemented once we have a proper database setup
	// For now, we'll just return
	return;
};
