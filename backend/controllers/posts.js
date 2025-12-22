const fs = require("node:fs");
const path = require("node:path");
const marked = require("marked");

// Define the path to store posts - use frontend content/posts directory
const postsDir = path.join(__dirname, "../../frontend/src/content/posts");

// Create posts directory if it doesn't exist
if (!fs.existsSync(postsDir)) {
	fs.mkdirSync(postsDir, { recursive: true });
}

// Create posts directory if it doesn't exist
if (!fs.existsSync(postsDir)) {
	fs.mkdirSync(postsDir, { recursive: true });
}

/**
 * Get all posts
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Promise<Object>} JSON response
 */
exports.getPosts = async (_req, res) => {
	try {
		// Debug: Log posts directory path
		console.log(`Posts directory: ${postsDir}`);
		console.log(`Posts directory exists: ${fs.existsSync(postsDir)}`);
		
		// Read all post files
		const files = fs.readdirSync(postsDir, { encoding: 'utf8' });
		console.log(`Found ${files.length} files in posts directory`);
		
		const posts = [];

		for (const file of files) {
			if (file.endsWith(".md")) {
				console.log(`Processing file: ${file}`);
				const filePath = path.join(postsDir, file);
				
				// Extract ID from filename (first part before the hyphen)
				const id = parseInt(file.split('-')[0]);
				
				// Read file content with comprehensive encoding detection
				let fileContent = "";
				const buffer = fs.readFileSync(filePath);
				const iconv = require('iconv-lite');
				
				// Try different encodings to find the correct one
				const encodings = ['utf8', 'gbk', 'gb2312', 'big5'];
				let detectedEncoding = 'utf8';
				
				for (const encoding of encodings) {
					try {
						fileContent = iconv.decode(buffer, encoding);
						// Check if decoding resulted in valid content (no replacement characters)
						if (!/[\uFFFD]/.test(fileContent)) {
							detectedEncoding = encoding;
							break;
						}
					} catch (e) {
						// Skip invalid encodings
					}
				}
				
				// If all encodings result in replacement characters, use UTF-8 with fallback
				if (/[\uFFFD]/.test(fileContent)) {
					// Try to clean up the content by removing replacement characters
					fileContent = fileContent.replace(/[\uFFFD]/g, '');
				}
				
				// Parse frontmatter if it exists
				let title = path.basename(file, ".md").replace(/^\d+-/, '');
				let status = "published";
				let publishedDate = new Date().toISOString();
				
				// Check for frontmatter
				const frontmatterMatch = fileContent.match(/^---\n([\s\S]*?)\n---\n/);
				if (frontmatterMatch) {
					const frontmatterText = frontmatterMatch[1];
					
					// Extract title from frontmatter if available
					const titleMatch = frontmatterText.match(/title:\s*["']?(.*?)["']?\n/);
					if (titleMatch) {
						title = titleMatch[1];
					}
					
					// Extract status from frontmatter if available
					const statusMatch = frontmatterText.match(/draft:\s*(true|false)/i);
					if (statusMatch) {
						status = statusMatch[1].toLowerCase() === 'true' ? 'draft' : 'published';
					}
					
					// Extract published date from frontmatter if available
					const dateMatch = frontmatterText.match(/published:\s*["']?(.*?)["']?\n/);
					if (dateMatch) {
						try {
							publishedDate = new Date(dateMatch[1]).toISOString();
						} catch (e) {
							// Use current date if parsing fails
							publishedDate = new Date().toISOString();
						}
					}
				}
				
				// Generate slug from title
				const slug = title
					.replace(/[^\w\u4e00-\u9fa5]+/g, '-')
					.replace(/(^-|-$)/g, '')
					.toLowerCase();
				
				// Create complete post object with all necessary fields
				const post = {
					id,
					title: title,
					excerpt: "",
					content: "",
					categories: [],
					tags: [],
					status: status,
					publishedDate: publishedDate,
					updatedDate: publishedDate,
					createdAt: publishedDate,
					filename: file,
					slug: slug,
				};
				
				posts.push(post);
			}
		}

		// Sort posts by published date (newest first)
		posts.sort((a, b) => new Date(b.publishedDate) - new Date(a.publishedDate));

		console.log(`Returning ${posts.length} posts`);
		res.status(200).json({
			success: true,
			data: posts,
			total: posts.length,
		});
	} catch (error) {
		console.error("Get posts error:", error);
		console.error("Error stack:", error.stack);
		res.status(500).json({
			success: false,
			message: "Internal server error",
			error: error.message,
			stack: error.stack
		});
	}
};

/**
 * Get a single post by ID
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Promise<Object>} JSON response
 */
exports.getPostById = async (req, res) => {
	try {
		const { id } = req.params;
		
		// Read all post files
		const files = fs.readdirSync(postsDir, { encoding: 'utf8' });
		let foundPost = null;
		
		for (const file of files) {
			if (file.endsWith(".md")) {
				// Extract ID from filename (first part before the hyphen)
				const postId = parseInt(file.split('-')[0]);
				
				// Check if this is the post we're looking for
				if (postId === parseInt(id)) {
					// 简化标题获取：直接从文件名提取，去掉时间戳和.md后缀
					const fileNameWithoutExt = path.basename(file, ".md");
					// 去掉前缀的时间戳
					const title = fileNameWithoutExt.replace(/^\d+-/, '');
					
					// 简化处理：创建基本的post对象
					foundPost = {
						id: postId,
						title: title,
						excerpt: "",
						content: "",
						categories: [],
						tags: [],
						status: "published",
						publishedDate: new Date().toISOString(),
						updatedDate: new Date().toISOString(),
						createdAt: new Date().toISOString(),
						filename: file,
						slug: title.replace(/[^\w\u4e00-\u9fa5]+/g, '-').replace(/(^-|-$)/g, '').toLowerCase(),
					};
					break;
				}
			}
		}
		
		if (foundPost) {
			res.status(200).json({ success: true, data: foundPost });
		} else {
			res.status(404).json({ success: false, message: "Post not found" });
		}
	} catch (error) {
		console.error("Get post by ID error:", error);
		res.status(500).json({ success: false, message: "Internal server error" });
	}
};

/**
 * Delete a post
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Promise<Object>} JSON response
 */
exports.deletePost = async (req, res) => {
	try {
		const { id } = req.params;
		
		// Find the post file by ID
        const files = fs.readdirSync(postsDir, { encoding: 'utf8' });
		let postFile = null;
		let foundId = null;
		
		for (const file of files) {
			// Extract ID from filename (first part before the hyphen)
			const fileId = parseInt(file.split('-')[0]);
			if (fileId === parseInt(id)) {
				postFile = file;
				foundId = fileId;
				break;
			}
		}
		
		if (!postFile) {
			// Try to find by filename if ID match fails
			for (const file of files) {
				if (file === id || file === `${id}.md`) {
					postFile = file;
					break;
				}
			}
		}
		
		if (!postFile) {
			return res.status(404).json({
				success: false,
				message: "Post not found",
				debug: {
					requestedId: id,
					postsDir: postsDir,
					files: files
				}
			});
		}
		
		const filePath = path.join(postsDir, postFile);

		// Delete post file
		fs.unlinkSync(filePath);

		res.status(200).json({
			success: true,
			message: "Post deleted successfully",
			data: {
				id: foundId || id,
				filename: postFile
			}
		});
	} catch (error) {
		console.error("Delete post error:", error);
		res.status(500).json({
			success: false,
			message: "Internal server error: " + error.message,
			error: error.stack
		});
	}
};

/**
 * Upload a markdown file to create a post
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Promise<Object>} JSON response
 */
exports.uploadPost = async (req, res) => {
	try {
		// Check if file was uploaded
		if (!req.file) {
			return res.status(400).json({
				success: false,
				message: "No file uploaded or invalid file type. Only .md files are allowed.",
			});
		}

		const file = req.file;
		
		// Read file content with comprehensive encoding detection
		let fileContent = "";
		const buffer = fs.readFileSync(file.path);
		const iconv = require('iconv-lite');
		
		// Try different encodings to find the correct one
		const encodings = ['utf8', 'gbk', 'gb2312', 'big5'];
		let detectedEncoding = 'utf8';
		
		for (const encoding of encodings) {
			try {
				fileContent = iconv.decode(buffer, encoding);
				// Check if decoding resulted in valid content (no replacement characters)
				if (!/[\uFFFD]/.test(fileContent)) {
					detectedEncoding = encoding;
					break;
				}
			} catch (e) {
				// Skip invalid encodings
			}
		}
		
		// If all encodings result in replacement characters, use UTF-8 with fallback
		if (/[\uFFFD]/.test(fileContent)) {
			// Try to clean up the content by removing replacement characters
			fileContent = fileContent.replace(/[\uFFFD]/g, '');
		}
		
		console.log(`Detected encoding: ${detectedEncoding} for file: ${file.originalname}`);
		
		// Extract title from filename
		let title = path.basename(file.originalname, ".md");
		
		// Check if frontmatter exists and has required fields
		let hasFrontmatter = false;
		let frontmatterText = "";
		let content = fileContent;
		
		const frontmatterMatch = fileContent.match(/^---\n([\s\S]*?)\n---\n/);
		if (frontmatterMatch) {
			hasFrontmatter = true;
			frontmatterText = frontmatterMatch[1];
			content = fileContent.substring(frontmatterMatch[0].length);
		}
		
		// Parse frontmatter lines
		const frontmatterLines = frontmatterText.split('\n').filter(line => line.trim());
		const frontmatter = {};
		
		for (const line of frontmatterLines) {
			const colonIndex = line.indexOf(':');
			if (colonIndex === -1) continue;
			
			const key = line.substring(0, colonIndex).trim();
			let value = line.substring(colonIndex + 1).trim();
			frontmatter[key] = value.replace(/^["'](.*)["']$/, '$1');
		}
		
		// Ensure required frontmatter fields exist
		if (!frontmatter.title) {
			frontmatter.title = title;
		} else {
			title = frontmatter.title;
		}
		
		if (!frontmatter.published) {
			frontmatter.published = new Date().toISOString();
		}
		
		// Reconstruct frontmatter with required fields
		const updatedFrontmatter = Object.entries(frontmatter)
			.map(([key, value]) => {
				// For string values with special characters, wrap in quotes
				if (typeof value === 'string' && /[\u4e00-\u9fa5\s\&\*\(\)\[\]\{\}\|\\;:'"<>?]/.test(value)) {
					return `${key}: "${value}"`;
				}
				return `${key}: ${value}`;
			})
			.join('\n');
		
		// Reconstruct file content with proper frontmatter
		const updatedFileContent = hasFrontmatter 
			? `---\n${updatedFrontmatter}\n---\n${content}`
			: `---\ntitle: "${frontmatter.title}"\npublished: ${frontmatter.published}\n---\n${content}`;
		
		// Generate safe filename with timestamp and slug
		const slug = title
			.replace(/[^\w\u4e00-\u9fa5]+/g, '-')
			.replace(/(^-|-$)/g, '')
			.substring(0, 50);
		
		const filename = `${Date.now()}-${slug}.md`;
		const destPath = path.join(postsDir, filename);
		
		// Write updated content with proper frontmatter
		fs.writeFileSync(destPath, updatedFileContent, { encoding: 'utf8' });
		
		// Delete temporary file
		if (fs.existsSync(file.path)) {
			fs.unlinkSync(file.path);
		}
		
		res.status(201).json({
			success: true,
			message: "Post uploaded successfully",
			data: {
				filename,
				title: frontmatter.title,
			}
		});
	} catch (error) {
		console.error("Upload post error:", error);
		
		// Clean up temporary file if it exists
		if (req.file && fs.existsSync(req.file.path)) {
			fs.unlinkSync(req.file.path);
		}
		
		res.status(500).json({
			success: false,
			message: "Internal server error: " + error.message,
		});
	}
};

/**
 * Update a post
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Promise<Object>} JSON response
 */
exports.updatePost = async (req, res) => {
	try {
		const { id } = req.params;
		const postData = req.body;
		
		// Validate required fields
		if (!postData.title) {
			return res.status(400).json({
				success: false,
				message: "Title is required"
			});
		}
		
		// Find the post file by ID
		const files = fs.readdirSync(postsDir, { encoding: 'utf8' });
		let postFile = null;
		let postId = null;
		
		console.log('DEBUG: Looking for post with id:', id);
		console.log('DEBUG: Files in posts directory:', files);
		
		const requestedId = parseInt(id);
		
		for (const file of files) {
			if (file.endsWith(".md")) {
				// Try different ways to match the file:
				// 1. Exact filename match (for files like "1.md", "2.md")
				if (file === `${id}.md`) {
					postFile = file;
					postId = requestedId;
					console.log('DEBUG: Found exact match file:', file);
					break;
				}
				
				// 2. Extract ID from filename with hyphen (for files like "1766376017755-ai.md")
				const fileIdStr = file.split('-')[0];
				const fileId = parseInt(fileIdStr);
				console.log('DEBUG: Checking file:', file, 'with extracted id:', fileId);
				
				if (!isNaN(fileId) && fileId === requestedId) {
					postFile = file;
					postId = fileId;
					console.log('DEBUG: Found matching file by ID:', file);
					break;
				}
			}
		}
		
		if (!postFile) {
			console.log('DEBUG: Post not found for id:', id);
			return res.status(404).json({
				success: false,
				message: "Post not found"
			});
		}
		
		const filePath = path.join(postsDir, postFile);
		
		// Read current post content
		const fileContent = fs.readFileSync(filePath, 'utf8');
		
		// Parse frontmatter
		let frontmatterText = "";
		let content = fileContent;
		const frontmatterMatch = fileContent.match(/^---\n([\s\S]*?)\n---\n/);
		
		if (frontmatterMatch) {
			frontmatterText = frontmatterMatch[1];
			content = fileContent.substring(frontmatterMatch[0].length);
		}
		
		// Parse current frontmatter
		const frontmatter = {};
		const frontmatterLines = frontmatterText.split('\n').filter(line => line.trim());
		
		for (const line of frontmatterLines) {
			const colonIndex = line.indexOf(':');
			if (colonIndex === -1) continue;
			
			const key = line.substring(0, colonIndex).trim();
			let value = line.substring(colonIndex + 1).trim();
			frontmatter[key] = value.replace(/^["'](.*)["']$/, '$1');
		}
		
		// Update frontmatter with new data
        frontmatter.title = postData.title;
        frontmatter.published = postData.published || frontmatter.published || new Date().toISOString();
        
        // Handle tags
        if (postData.tags) {
            // If tags is an array (from frontend), use it directly
            const tagsArray = Array.isArray(postData.tags) 
                ? postData.tags.filter(tag => typeof tag === 'string' && tag.trim())
                : postData.tags.split(',').map(tag => tag.trim()).filter(Boolean);
            frontmatter.tags = tagsArray.length > 0 ? tagsArray : [];
        }
        
        // Handle categories
        if (postData.category !== undefined) {
            // If category is a string, split into array
            const categoriesArray = typeof postData.category === 'string' 
                ? postData.category.split(',').map(cat => cat.trim()).filter(Boolean)
                : (Array.isArray(postData.category) ? postData.category : []);
            frontmatter.categories = categoriesArray.length > 0 ? categoriesArray : [];
        }
        
        // Update other fields if provided
        if (postData.description !== undefined) frontmatter.description = postData.description;
        if (postData.image !== undefined) frontmatter.image = postData.image;
        if (postData.draft !== undefined) frontmatter.draft = postData.draft;
        if (postData.updated !== undefined) frontmatter.updated = postData.updated;
		
		// Reconstruct frontmatter
		const updatedFrontmatter = Object.entries(frontmatter)
			.map(([key, value]) => {
				if (Array.isArray(value)) {
					// Format arrays as YAML arrays
					return `${key}:
${value.map(tag => `  - ${tag}`).join('\n')}`;
				}
				
				// For string values with special characters, wrap in quotes
				if (typeof value === 'string' && /[\u4e00-\u9fa5\s\&\*\(\)\[\]\{\}\|\\;:'"<>?]/.test(value)) {
					return `${key}: "${value}"`;
				}
				
				return `${key}: ${value}`;
			})
			.join('\n');
		
		// Reconstruct file content
		const updatedFileContent = `---\n${updatedFrontmatter}\n---\n${content}`;
		
		// Write updated content back to file
		fs.writeFileSync(filePath, updatedFileContent, 'utf8');
		
		// Return success response
		res.status(200).json({
			success: true,
			message: "Post updated successfully",
			data: {
				id: postId,
				title: frontmatter.title
			}
		});
	} catch (error) {
		console.error("Update post error:", error);
		res.status(500).json({
			success: false,
			message: "Internal server error: " + error.message,
			error: error.stack
		});
	}
};
