// Timeline data configuration file
// Used to manage data for the timeline page

export interface TimelineItem {
	id: string;
	title: string;
	description: string;
	type: "education" | "work" | "project" | "achievement";
	startDate: string;
	endDate?: string; // If empty, it means current
	location?: string;
	organization?: string;
	position?: string;
	skills?: string[];
	achievements?: string[];
	links?: {
		name: string;
		url: string;
		type: "website" | "certificate" | "project" | "other";
	}[];
	icon?: string; // Iconify icon name
	color?: string;
	featured?: boolean;
}

export const timelineData: TimelineItem[] = [
	{
		id: "current-study",
		title: "正在学习人工智能专业",
		description: "正在学习计算机科学与技术相关知识，什么都学了一点点，就很尴尬。",
		type: "education",
		startDate: "2023-09-01",
		location: "温州",
		organization: "温州大学",
		skills: ["Java", "Python", "JavaScript", "Godot", "MySQL"],
		achievements: [
			"当前GPA：3.3/5.0",
			"已完成数据结构与算法课程项目",
			"参与过多个课程项目的开发",
		],
		icon: "material-symbols:school",
		color: "#059669",
		featured: true,
	},
	{
		id: "zyh-blog-project",
		title: "zyh's World Blog Project",
		description:
			"我用Astro框架，基于Mizuki的模板，开发了一个个人博客网站，用于学习前端技术。",
		type: "project",
		startDate: "2025-09-22",
		endDate: "2025-10-30",
		skills: ["Astro", "TypeScript", "Tailwind CSS", "Tomcat"],
		achievements: [
			"熟悉了现代前端开发技术栈",
			"学习了响应式设计和用户体验优化",
			"完成了从设计到部署的全流程",
			"完成了前端管理页面的实现",
		],
		links: [
			{
				name: "GitHub Repository",
				url: "https://github.com/Sat-Y/Silver-world",
				type: "project",
			},
			{
				name: "Live Demo",
				url: "https://silver-z.netlify.app",
				type: "website",
			},
		],
		icon: "material-symbols:code",
		color: "#7C3AED",
		featured: true,
	},
	{
		id: "2D-adventure-game",
		title: "2D像素风冒险游戏",
		description: "使用Python和Godot引擎开发的2D像素风冒险游戏，包含角色移动、敌人AI、碰撞检测等功能。",
		type: "project",
		startDate: "2025-07-01",
		endDate: "2025-09-01",
		skills: ["Python", "Godot", "GDscript"],
		achievements: [
			"完成了角色状态机设计",
			"完成了敌人行为设计",
			"完成了对话存档等交互功能",
		],
		icon: "material-symbols:game",
		color: "#0c74eaff",
	},
	{
		id: "student-management-system",
		title: "校园外卖管理系统课程项目",
		description: "数据库课程的最终项目，开发了一个完整的校园外卖管理系统。",
		type: "project",
		startDate: "2025-03-01",
		endDate: "2025-05-15",
		skills: ["Python", "MySQL", "Flask", "Vue", "Redis"],
		achievements: [
			"课程项目获得优秀成绩",
			"完成了从设计到部署的全流程",
			"学习了数据库设计与优化",
		],
		icon: "material-symbols:database",
		color: "#EA580C",
	},
];

// Get timeline statistics
export const getTimelineStats = () => {
	const total = timelineData.length;
	const byType = {
		education: timelineData.filter((item) => item.type === "education").length,
		work: timelineData.filter((item) => item.type === "work").length,
		project: timelineData.filter((item) => item.type === "project").length,
		achievement: timelineData.filter((item) => item.type === "achievement")
			.length,
	};

	return { total, byType };
};

// Get timeline items by type
export const getTimelineByType = (type?: string) => {
	if (!type || type === "all") {
		return timelineData.sort(
			(a, b) =>
				new Date(b.startDate).getTime() - new Date(a.startDate).getTime(),
		);
	}
	return timelineData
		.filter((item) => item.type === type)
		.sort(
			(a, b) =>
				new Date(b.startDate).getTime() - new Date(a.startDate).getTime(),
		);
};

// Get featured timeline items
export const getFeaturedTimeline = () => {
	return timelineData
		.filter((item) => item.featured)
		.sort(
			(a, b) =>
				new Date(b.startDate).getTime() - new Date(a.startDate).getTime(),
		);
};

// Get current ongoing items
export const getCurrentItems = () => {
	return timelineData.filter((item) => !item.endDate);
};

// Calculate total work experience
export const getTotalWorkExperience = () => {
	const workItems = timelineData.filter((item) => item.type === "work");
	let totalMonths = 0;

	workItems.forEach((item) => {
		const startDate = new Date(item.startDate);
		const endDate = item.endDate ? new Date(item.endDate) : new Date();
		const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
		const diffMonths = Math.ceil(diffTime / (1000 * 60 * 60 * 24 * 30));
		totalMonths += diffMonths;
	});

	return {
		years: Math.floor(totalMonths / 12),
		months: totalMonths % 12,
	};
};
