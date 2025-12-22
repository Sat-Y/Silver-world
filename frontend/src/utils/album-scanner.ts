import * as fs from "node:fs";
import * as path from "node:path";
import type { AlbumGroup, Photo } from "../types/album";

export async function scanAlbums(): Promise<AlbumGroup[]> {
	try {
		// 从后端 API 获取相册数据
		const apiUrl = "http://localhost:3001/api/albums"; // 修改 API 路径，移除 /admin 前缀
		console.log(`=== Attempting to fetch albums from API: ${apiUrl} ===`);
		const response = await fetch(apiUrl, {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
			},
		});

		console.log(`API Response status: ${response.status}`);
		if (response.ok) {
			const result = await response.json();
			console.log("API Response body:", result);
			if (result.success && Array.isArray(result.data)) {
				console.log(`API returned ${result.data.length} albums`);
				// 转换 API 返回的数据格式为前端所需的 AlbumGroup 格式
				const apiAlbums: AlbumGroup[] = result.data.map((apiAlbum: any) => {
					console.log("Processing album:", apiAlbum);
					// 将后端返回的 photos 转换为前端所需的 Photo 格式
					const photos: Photo[] = apiAlbum.photos.map((photo: any) => {
						console.log("Processing photo:", photo);
						// 确保图片 URL 是完整的，包含 http:// 或 https://
						let photoUrl = photo.url || photo.src;
						if (
							photoUrl &&
							!photoUrl.startsWith("http") &&
							!photoUrl.startsWith("/")
						) {
							// 如果是相对路径，添加完整的域名
							photoUrl = `http://localhost:3001/uploads/${photoUrl}`;
						} else if (photoUrl && photoUrl.startsWith("/")) {
							// 如果是根路径，添加完整的域名
							photoUrl = `http://localhost:3001${photoUrl}`;
						}
						return {
							id: photo.id,
							src: photoUrl, // 使用完整的图片 URL
							alt: photo.originalName || `Photo ${photo.id}`,
							title: photo.originalName || `Photo ${photo.id}`,
							tags: [],
							date: photo.uploadedAt || new Date().toISOString().split("T")[0],
						};
					});

					// 确保封面图片 URL 是完整的
					let coverUrl =
						photos.length > 0 ? photos[0].src : "/images/albums/cover.jpg";
					if (coverUrl && !coverUrl.startsWith("http")) {
						if (coverUrl.startsWith("/")) {
							coverUrl = `http://localhost:3001${coverUrl}`;
						} else {
							coverUrl = `http://localhost:3001/uploads/${coverUrl}`;
						}
					}
					console.log(`Final cover URL: ${coverUrl}`);

					const album: AlbumGroup = {
						id: apiAlbum.id,
						title: apiAlbum.title,
						description: apiAlbum.description,
						cover: coverUrl,
						date: apiAlbum.date,
						location: apiAlbum.location,
						tags: apiAlbum.tags ? apiAlbum.tags.filter(tag => tag !== null && tag !== undefined && tag !== '') : [],
						layout: "grid", // 默认布局
						columns: 3, // 默认列数
						photos: photos,
					};
					console.log("Processed album:", album);
					return album;
				});

				console.log(`=== Final API albums: ${apiAlbums.length} albums ===`);
				// 不管 API 返回的数据是否为空，都返回 API 返回的结果，不再回退到本地扫描
				return apiAlbums;
			}
		} else {
			console.error(`API request failed with status: ${response.status}`);
			const errorText = await response.text();
			console.error(`API error response: ${errorText}`);
		}
	} catch (error) {
		console.error("=== Exception when fetching albums from API ===");
		console.error(error);
	}

	// 不再回退到本地扫描，只使用 API 返回的数据
	// 这样可以更清楚地看到 API 请求的问题
	console.log("=== Returning empty array, no local fallback ===");
	return [];
}

async function processAlbumFolder(
	folderPath: string,
	folderName: string,
): Promise<AlbumGroup | null> {
	// 检查必要文件
	const infoPath = path.join(folderPath, "info.json");

	if (!fs.existsSync(infoPath)) {
		console.warn(`相册 ${folderName} 缺少 info.json 文件`);
		return null;
	}

	// 读取相册信息
	const infoContent = fs.readFileSync(infoPath, "utf-8");
	let info: Record<string, any>;
	try {
		info = JSON.parse(infoContent);
	} catch (e) {
		console.error(`相册 ${folderName} 的 info.json 格式错误:`, e);
		return null;
	}

	// 检查是否为外链模式
	const isExternalMode = info.mode === "external";
	let photos: Photo[] = [];
	let cover: string;

	if (isExternalMode) {
		// 外链模式：从 info.json 中获取封面和照片
		if (!info.cover) {
			console.warn(`相册 ${folderName} 外链模式缺少 cover 字段`);
			return null;
		}

		cover = info.cover;
		photos = processExternalPhotos(info.photos || [], folderName);
	} else {
		// 本地模式：检查本地文件
		const coverPath = path.join(folderPath, "cover.jpg");
		if (!fs.existsSync(coverPath)) {
			console.warn(`相册 ${folderName} 缺少 cover.jpg 文件`);
			return null;
		}

		cover = `/images/albums/${folderName}/cover.jpg`;
		photos = scanPhotos(folderPath, folderName);
	}

	// 检查是否隐藏相册
	if (info.hidden === true) {
		console.log(`相册 ${folderName} 已设置为隐藏，跳过显示`);
		return null;
	}

	// 构建相册对象
	return {
		id: folderName,
		title: info.title || folderName,
		description: info.description || "",
		cover,
		date: info.date || new Date().toISOString().split("T")[0],
		location: info.location || "",
		tags: info.tags || [],
		layout: info.layout || "grid",
		columns: info.columns || 3,
		photos,
	};
}

function scanPhotos(folderPath: string, albumId: string): Photo[] {
	const photos: Photo[] = [];
	const files = fs.readdirSync(folderPath);

	// 过滤出图片文件
	const imageFiles = files.filter((file) => {
		const ext = path.extname(file).toLowerCase();
		return (
			[
				".jpg",
				".jpeg",
				".png",
				".gif",
				".webp",
				".svg",
				".avif",
				".bmp",
				".tiff",
				".tif",
			].includes(ext) && file !== "cover.jpg"
		);
	});

	// 处理每张照片
	imageFiles.forEach((file, index) => {
		const filePath = path.join(folderPath, file);
		const stats = fs.statSync(filePath);

		// 解析文件名中的标签
		const { baseName, tags } = parseFileName(file);

		photos.push({
			id: `${albumId}-photo-${index}`,
			src: `/images/albums/${albumId}/${file}`,
			alt: baseName,
			title: baseName,
			tags: tags,
			date: stats.mtime.toISOString().split("T")[0],
		});
	});

	return photos;
}

function processExternalPhotos(
	externalPhotos: any[],
	albumId: string,
): Photo[] {
	const photos: Photo[] = [];

	externalPhotos.forEach((photo, index) => {
		if (!photo.src) {
			console.warn(`相册 ${albumId} 的第 ${index + 1} 张照片缺少 src 字段`);
			return;
		}

		photos.push({
			id: photo.id || `${albumId}-external-photo-${index}`,
			src: photo.src,
			thumbnail: photo.thumbnail,
			alt: photo.alt || photo.title || `Photo ${index + 1}`,
			title: photo.title,
			description: photo.description,
			tags: photo.tags || [],
			date: photo.date || new Date().toISOString().split("T")[0],
			location: photo.location,
			width: photo.width,
			height: photo.height,
			camera: photo.camera,
			lens: photo.lens,
			settings: photo.settings,
		});
	});

	return photos;
}

function parseFileName(fileName: string): { baseName: string; tags: string[] } {
	// 匹配文件名中的标签，格式为：文件名_标签1_标签2.扩展名
	const parts = path.basename(fileName, path.extname(fileName)).split("_");

	if (parts.length > 1) {
		// 第一部分作为基本名称，其余部分作为标签
		const baseName = parts.slice(0, -2).join("_");
		const tags = parts.slice(-2);
		return { baseName, tags };
	}

	// 如果没有标签，返回不带扩展名的文件名
	const baseName = path.basename(fileName, path.extname(fileName));
	return { baseName, tags: [] };
}
