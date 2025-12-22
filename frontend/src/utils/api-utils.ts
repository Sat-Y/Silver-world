/**
 * API工具函数
 * 用于处理与后端API的交互
 */

/**
 * 文章数据接口定义
 */
export interface ApiArticle {
	id: number;
	title: string;
	slug: string;
	content: string;
	publishedDate: string;
	updatedDate?: string;
	categories?: string[];
	tags?: string[];
	status: "published" | "draft";
	excerpt?: string;
	createdDate?: string;
	authorId?: number;
	viewCount?: number;
	[key: string]: any;
}

/**
 * 前端文章数据格式
 */
export interface FrontendArticle {
	id: number;
	title: string;
	slug: string;
	content: string;
	publishedDate: string;
	updatedDate?: string;
	categories?: string[];
	tags?: string[];
	[key: string]: any;
}

/**
 * API响应格式
 */
export interface ApiResponse<T> {
	success: boolean;
	data?: T;
	error?: string;
	message?: string;
	total?: number;
}

/**
 * 根据文章ID从API获取文章数据
 * @param articleId 文章ID
 * @returns Promise<ApiArticle | null>
 */
export async function fetchArticleById(
	articleId: number,
): Promise<ApiArticle | null> {
	try {
		// 从环境变量或配置中获取API基础URL
		const apiBaseUrl = import.meta.env.PUBLIC_API_BASE || "/api";
		const response = await fetch(`${apiBaseUrl}/articles/${articleId}`);

		if (!response.ok) {
			console.warn(`获取文章ID ${articleId} 失败: HTTP ${response.status}`);
			return null;
		}

		const result: ApiResponse<ApiArticle> = await response.json();

		if (result.success && result.data) {
			// 处理日期格式，确保前端使用正确的格式
			if (result.data.publishedDate) {
				result.data.publishedDate = formatDateForFrontend(
					result.data.publishedDate,
				);
			}
			if (result.data.updatedDate) {
				result.data.updatedDate = formatDateForFrontend(
					result.data.updatedDate,
				);
			}

			// 处理标签和分类
			if (result.data.tags && typeof result.data.tags === "string") {
				result.data.tags = result.data.tags
					.split(",")
					.map((tag) => tag.trim())
					.filter((tag) => tag.length > 0);
			}
			if (result.data.category) {
				result.data.categories = [result.data.category];
			}

			return result.data;
		}
		console.warn("API返回失败:", result.error || result.message || "未知错误");
		return null;
	} catch (error) {
		console.error(`获取文章ID ${articleId} 时发生错误:`, error);
		return null;
	}
}

/**
 * 格式化日期字符串以供前端使用
 * @param dateString 日期字符串
 * @returns 格式化后的日期字符串
 */
function formatDateForFrontend(dateString: string): string {
	try {
		// 尝试解析各种日期格式
		const date = new Date(dateString);
		if (!Number.isNaN(date.getTime())) {
			// 返回YYYY-MM-DD格式
			return date.toISOString().split("T")[0];
		}
	} catch (error) {
		console.warn("日期格式化失败:", error);
	}
	return dateString;
}

/**
 * 创建新文章
 * @param articleData 文章数据
 * @returns Promise<ApiArticle | null>
 */
export async function createArticle(
	articleData: Partial<ApiArticle>,
): Promise<ApiArticle | null> {
	try {
		const apiBaseUrl = import.meta.env.PUBLIC_API_BASE || "/api";

		// 准备发送到后端的数据
		const dataToSend = {
			...articleData,
			// 转换标签格式
			tags: Array.isArray(articleData.tags)
				? articleData.tags.join(",")
				: articleData.tags,
			// 转换分类格式
			category:
				articleData.categories && articleData.categories.length > 0
					? articleData.categories[0]
					: undefined,
		};

		const response = await fetch(`${apiBaseUrl}/admin/articles`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${localStorage.getItem("token")}`,
			},
			body: JSON.stringify(dataToSend),
		});

		if (!response.ok) {
			console.warn(`创建文章失败: HTTP ${response.status}`);
			return null;
		}

		const result: ApiResponse<ApiArticle> = await response.json();

		if (result.success && result.data) {
			// 处理返回的文章数据格式
			if (result.data.publishedDate) {
				result.data.publishedDate = formatDateForFrontend(
					result.data.publishedDate,
				);
			}
			if (result.data.tags && typeof result.data.tags === "string") {
				result.data.tags = result.data.tags
					.split(",")
					.map((tag) => tag.trim())
					.filter((tag) => tag.length > 0);
			}
			if (result.data.category) {
				result.data.categories = [result.data.category];
			}
			return result.data;
		}
		console.warn("API返回失败:", result.error || result.message || "未知错误");
		return null;
	} catch (error) {
		console.error("创建文章时发生错误:", error);
		return null;
	}
}

/**
 * 更新文章
 * @param articleId 文章ID
 * @param articleData 文章数据
 * @returns Promise<ApiArticle | null>
 */
export async function updateArticle(
	articleId: number,
	articleData: Partial<ApiArticle>,
): Promise<ApiArticle | null> {
	try {
		const apiBaseUrl = import.meta.env.PUBLIC_API_BASE || "/api";

		// 准备发送到后端的数据
		const dataToSend = {
			...articleData,
			// 转换标签格式
			tags: Array.isArray(articleData.tags)
				? articleData.tags.join(",")
				: articleData.tags,
			// 转换分类格式
			category:
				articleData.categories && articleData.categories.length > 0
					? articleData.categories[0]
					: undefined,
		};

		const response = await fetch(`${apiBaseUrl}/admin/articles/${articleId}`, {
			method: "PUT",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${localStorage.getItem("token")}`,
			},
			body: JSON.stringify(dataToSend),
		});

		if (!response.ok) {
			console.warn(`更新文章ID ${articleId} 失败: HTTP ${response.status}`);
			return null;
		}

		const result: ApiResponse<ApiArticle> = await response.json();

		if (result.success && result.data) {
			// 处理返回的文章数据格式
			if (result.data.publishedDate) {
				result.data.publishedDate = formatDateForFrontend(
					result.data.publishedDate,
				);
			}
			if (result.data.tags && typeof result.data.tags === "string") {
				result.data.tags = result.data.tags
					.split(",")
					.map((tag) => tag.trim())
					.filter((tag) => tag.length > 0);
			}
			if (result.data.category) {
				result.data.categories = [result.data.category];
			}
			return result.data;
		}
		console.warn("API返回失败:", result.error || result.message || "未知错误");
		return null;
	} catch (error) {
		console.error(`更新文章ID ${articleId} 时发生错误:`, error);
		return null;
	}
}

/**
 * 删除文章
 * @param articleId 文章ID
 * @returns Promise<boolean>
 */
export async function deleteArticle(articleId: number): Promise<boolean> {
	try {
		const apiBaseUrl = import.meta.env.PUBLIC_API_BASE || "/api";
		const response = await fetch(`${apiBaseUrl}/admin/articles/${articleId}`, {
			method: "DELETE",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${localStorage.getItem("token")}`,
			},
		});

		if (!response.ok) {
			console.warn(`删除文章ID ${articleId} 失败: HTTP ${response.status}`);
			return false;
		}

		const result: ApiResponse<null> = await response.json();

		if (result.success) {
			return true;
		}
		console.warn("API返回失败:", result.error || result.message || "未知错误");
		return false;
	} catch (error) {
		console.error(`删除文章ID ${articleId} 时发生错误:`, error);
		return false;
	}
}

/**
 * 将API返回的文章数据转换为前端使用的格式
 * @param apiArticle API返回的文章数据
 * @returns FrontendArticle
 */
export function transformApiArticleToFrontend(
	apiArticle: ApiArticle,
): FrontendArticle {
	// 基础字段映射
	const frontendArticle: FrontendArticle = {
		id: apiArticle.id,
		title: apiArticle.title,
		slug: apiArticle.slug,
		content: apiArticle.content,
		publishedDate: apiArticle.publishedDate,
		categories: apiArticle.categories,
		tags: apiArticle.tags,
	};

	// 如果有更新日期，也添加
	if (apiArticle.updatedDate) {
		frontendArticle.updatedDate = apiArticle.updatedDate;
	}

	// 可以在这里添加其他需要转换或处理的字段

	return frontendArticle;
}

/**
 * 获取已发布的文章列表
 * @returns Promise<ApiArticle[] | null>
 */
export async function fetchPublishedArticles(): Promise<ApiArticle[] | null> {
	try {
		const apiBaseUrl = import.meta.env.PUBLIC_API_BASE || "/api";
		const response = await fetch(`${apiBaseUrl}/articles/published`);

		if (!response.ok) {
			console.warn(`获取已发布文章列表失败: HTTP ${response.status}`);
			return null;
		}

		const result: ApiResponse<ApiArticle[]> = await response.json();

		if (result.success && result.data) {
			return result.data;
		}
		console.warn("API返回失败:", result.error || "未知错误");
		return null;
	} catch (error) {
		console.error("获取已发布文章列表时发生错误:", error);
		return null;
	}
}
