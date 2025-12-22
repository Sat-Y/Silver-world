const {
	hashPassword,
	comparePassword,
	generateToken,
} = require("../utils/auth");

// In-memory user storage (for demonstration purposes)
const users = [];

/**
 * Register a new user
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Promise<Object>} JSON response
 */
exports.register = async (req, res) => {
	try {
		const { username, email, password } = req.body;

		// Validate input
		if (!username || !email || !password) {
			return res.status(400).json({
				success: false,
				message: "Please provide all required fields",
			});
		}

		// Check if user already exists
		const existingUser = users.find(
			(user) => user.username === username || user.email === email,
		);
		if (existingUser) {
			return res.status(400).json({
				success: false,
				message: "User with this username or email already exists",
			});
		}

		// Hash password
		const hashedPassword = await hashPassword(password);

		// Create new user
		const newUser = {
			id: Date.now(),
			username,
			email,
			password: hashedPassword,
			role: "user",
			createdAt: new Date().toISOString(),
			updatedAt: new Date().toISOString(),
		};

		// Save user to in-memory storage
		users.push(newUser);

		// Generate token
		const token = generateToken(newUser);

		// Return response without password
		const userResponse = { ...newUser };
		delete userResponse.password;

		res.status(201).json({
			success: true,
			message: "User registered successfully",
			data: {
				user: userResponse,
				token,
			},
		});
	} catch (error) {
		console.error("Register error:", error);
		res.status(500).json({
			success: false,
			message: "Internal server error",
		});
	}
};

/**
 * Login a user
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Promise<Object>} JSON response
 */
exports.login = async (req, res) => {
	try {
		const { username, password } = req.body;

		// Validate input
		if (!username || !password) {
			return res.status(400).json({
				success: false,
				message: "Please provide username and password",
			});
		}

		// Find user in memory
		const user = users.find((user) => user.username === username);

		// If user not found, return error
		if (!user) {
			return res.status(401).json({
				success: false,
				message: "Invalid credentials",
			});
		}

		// Compare passwords
		const isMatch = await comparePassword(password, user.password);
		if (!isMatch) {
			return res.status(401).json({
				success: false,
				message: "Invalid credentials",
			});
		}

		// Generate token
		const token = generateToken(user);

		// Return response without password
		const userResponse = { ...user };
		delete userResponse.password;

		res.status(200).json({
			success: true,
			message: "Login successful",
			data: {
				user: userResponse,
				token,
			},
		});
	} catch (error) {
		console.error("Login error:", error);
		res.status(500).json({
			success: false,
			message: "Internal server error",
		});
	}
};

/**
 * Get current logged in user
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Promise<Object>} JSON response
 */
exports.getMe = async (req, res) => {
	try {
		if (!req.user) {
			return res.status(401).json({
				success: false,
				message: "Not authenticated",
			});
		}

		// Find user in storage
		const user = users.find((user) => user.id === req.user.id);
		if (!user) {
			return res.status(404).json({
				success: false,
				message: "User not found",
			});
		}

		// Return response without password
		const userResponse = { ...user };
		delete userResponse.password;

		res.status(200).json({
			success: true,
			data: userResponse,
		});
	} catch (error) {
		console.error("Get me error:", error);
		res.status(500).json({
			success: false,
			message: "Internal server error",
		});
	}
};

/**
 * Initialize default admin user if it doesn't exist
 * @returns {Promise<void>}
 */
exports.initDefaultAdmin = async () => {
	try {
		// Check if admin user already exists
		const adminExists = users.find(
			(user) => user.username === process.env.ADMIN_USERNAME,
		);
		if (adminExists) {
			return;
		}

		// Create default admin user
		const hashedPassword = await hashPassword(process.env.ADMIN_PASSWORD);

		const adminUser = {
			id: 1,
			username: process.env.ADMIN_USERNAME,
			email: "admin@example.com",
			password: hashedPassword,
			role: "admin",
			createdAt: new Date().toISOString(),
			updatedAt: new Date().toISOString(),
		};

		users.push(adminUser);
		console.log("Default admin user created successfully");
		console.log(`Username: ${process.env.ADMIN_USERNAME}`);
		console.log(`Password: ${process.env.ADMIN_PASSWORD}`);
	} catch (error) {
		console.error("Error creating default admin user:", error);
	}
};
