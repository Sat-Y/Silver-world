import * as fs from "node:fs";
import * as path from "node:path";
import type { AlbumGroup, Photo } from "../types/album";

export async function scanAlbums(): Promise<AlbumGroup[]> {
	try {
		console.log("=== Attempting to fetch albums from localStorage ===");
		
		if (typeof window === 'undefined') {
			console.log("=== Running in server environment, returning empty array ===");
			return [];
		}
		
		const ALBUMS_STORAGE_KEY = 'mizuki_albums';
		const stored = localStorage.getItem(ALBUMS_STORAGE_KEY);
		
		if (!stored) {
			console.log("=== No albums found in localStorage ===");
			return [];
		}
		
		const albums = JSON.parse(stored);
		console.log(`=== Found ${albums.length} albums in localStorage ===`);
		
		const apiAlbums: AlbumGroup[] = albums.map((apiAlbum: any) => {
			console.log("Processing album:", apiAlbum);
			const photos: Photo[] = apiAlbum.photos.map((photo: any) => {
				console.log("Processing photo:", photo);
				let photoUrl = photo.url || photo.src;
				return {
					id: photo.id,
					src: photoUrl,
					alt: photo.originalName || `Photo ${photo.id}`,
					title: photo.originalName || `Photo ${photo.id}`,
					tags: [],
					date: photo.uploadedAt || new Date().toISOString().split("T")[0],
				};
			});

			let coverUrl = photos.length > 0 ? photos[0].src : "/images/albums/cover.jpg";
			console.log(`Final cover URL: ${coverUrl}`);

			const album: AlbumGroup = {
				id: apiAlbum.id,
				title: apiAlbum.title,
				description: apiAlbum.description,
				cover: coverUrl,
				date: apiAlbum.date,
				location: apiAlbum.location,
				tags: apiAlbum.tags ? apiAlbum.tags.filter((tag: any) => tag !== null && tag !== undefined && tag !== '') : [],
				layout: "grid",
				columns: 3,
				photos: photos,
			};
			console.log("Processed album:", album);
			return album;
		});

		console.log(`=== Final localStorage albums: ${apiAlbums.length} albums ===`);
		return apiAlbums;
	} catch (error) {
		console.error("=== Exception when fetching albums from localStorage ===");
		console.error(error);
	}

	console.log("=== Returning empty array ===");
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
