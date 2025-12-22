// Skill data configuration file
// Used to manage data for the skill display page

export interface Skill {
	id: string;
	name: string;
	description: string;
	icon: string; // Iconify icon name
	category: "frontend" | "backend" | "database" | "tools" | "other";
	level: "beginner" | "intermediate" | "advanced" | "expert" | "basics";
	experience: {
		years: number;
		months: number;
	};
	projects?: string[]; // Related project IDs
	certifications?: string[];
	color?: string; // Skill card theme color
}

export const skillsData: Skill[] = [
	// Frontend Skills
	{
		id: "javascript",
		name: "JavaScript",
		description: "现代JavaScript开发，包括ES6+语法、异步编程和模块化开发.",
		icon: "logos:javascript",
		category: "frontend",
		level: "basics",
		experience: { years: 0, months: 1 },
		projects: ["zyh's world"],
		color: "#F7DF1E",
	},
	{
		id: "typescript",
		name: "TypeScript",
		description: "一个类型安全的JavaScript超集，可提高代码质量和开发效率.",
		icon: "logos:typescript-icon",
		category: "frontend",
		level: "basics",
		experience: { years: 0, months: 1 },
		projects: ["zyh's world"],
		color: "#3178C6",
	},
	{
		id: "vue",
		name: "Vue.js",
		description: "一个渐进式JavaScript框架，易于学习和使用，适合快速开发.",
		icon: "logos:vue",
		category: "frontend",
		level: "beginner",
		experience: { years: 0, months: 3 },
		projects: ["外卖管理系统课设"],
		color: "#4FC08D",
	},
	{
		id: "astro",
		name: "Astro",
		description: "一个支持多框架集成并具有卓越性能的现代静态网站生成器.",
		icon: "logos:astro-icon",
		category: "frontend",
		level: "basics",
		experience: { years: 0, months: 1 },
		projects: ["zyh's world"],
		color: "#FF5D01",
	},

	// Backend Skills
	{
		id: "nodejs",
		name: "Node.js",
		description: "一个基于Chrome V8引擎的JavaScript运行时，用于服务器端开发.",
		icon: "logos:nodejs-icon",
		category: "backend",
		level: "basics",
		experience: { years: 0, months: 3 },
		projects: ["外卖管理系统课设"],
		color: "#339933",
	},
	{
		id: "python",
		name: "Python",
		description: "一种通用编程语言，适用于Web开发、数据分析、机器学习等领域.",
		icon: "logos:python",
		category: "backend",
		level: "beginner",
		experience: { years: 0, months: 5 },
		color: "#3776AB",
	},
	{
		id: "java",
		name: "Java",
		description: "一种主流的企业应用开发编程语言，跨平台且面向对象.",
		icon: "logos:java",
		category: "backend",
		level: "basics",
		experience: { years: 0, months: 3 },
		projects: ["zyh's world"],
		color: "#ED8B00",
	},
	{
		id: "cpp",
		name: "C++",
		description:
			"一种高性能的系统编程语言，广泛应用于游戏开发、系统软件和嵌入式开发领域.",
		icon: "logos:c-plusplus",
		category: "backend",
		level: "basics",
		experience: { years: 0, months: 2 },
		projects: ["路边一条游戏开发"],
		color: "#00599C",
	},
	{
		id: "c",
		name: "C",
		description: "一种低级系统编程语言，是操作系统和嵌入式系统开发的基础.",
		icon: "logos:c",
		category: "backend",
		level: "intermediate",
		experience: { years: 1, months: 1 },
		color: "#A8B9CC",
	},
	{
		id: "godot",
		name: "Godot",
		description: "一个游戏开发引擎中使用的语言.",
		icon: "logos:godot-icon",
		category: "backend",
		level: "intermediate",
		experience: { years: 0, months: 3 },
		projects: ["路边一条游戏开发"],
		color: "#092E20",
	},

	// Database Skills
	{
		id: "mysql",
		name: "MySQL",
		description:
			"世界上最流行的开源关系型数据库管理系统，广泛应用于Web应用程序中.",
		icon: "logos:mysql-icon",
		category: "database",
		level: "beginner",
		experience: { years: 0, months: 6 },
		projects: ["外卖管理系统课设", "zyh's world"],
		color: "#4479A1",
	},
	{
		id: "redis",
		name: "Redis",
		description: "一种高性能的内存数据结构存储，用作数据库、缓存和消息代理.",
		icon: "logos:redis",
		category: "database",
		level: "basics",
		experience: { years: 0, months: 2 },
		projects: ["外卖管理系统课设"],
		color: "#DC382D",
	},

	// Tools
	{
		id: "vscode",
		name: "VS Code",
		description: "一款轻量级但功能强大的代码编辑器，拥有丰富的插件生态系统.",
		icon: "logos:visual-studio-code",
		category: "tools",
		level: "beginner",
		experience: { years: 2, months: 6 },
		color: "#007ACC",
	},
	{
		id: "trae",
		name: "Trae",
		description: "一个结合ai的代码编辑器，提供额外的功能和插件.",
		icon: "material-symbols:code-blocks",
		category: "tools",
		level: "intermediate",
		experience: { years: 1, months: 3 },
		color: "#007ACC",
	},
	{
		id: "intellij",
		name: "IntelliJ IDEA",
		description:
			"JetBrains旗舰级IDE，Java开发的首选工具，提供强大的智能编码辅助功能.",
		icon: "logos:intellij-idea",
		category: "tools",
		level: "beginner",
		experience: { years: 1, months: 1 },
		color: "#000000",
	},
	{
		id: "pycharm",
		name: "PyCharm",
		description:
			"一个专业的Python IDE，由JetBrains提供，提供智能代码分析和调试功能.",
		icon: "logos:pycharm",
		category: "tools",
		level: "beginner",
		experience: { years: 1, months: 4 },
		color: "#21D789",
	},
	{
		id: "tomcat",
		name: "Apache Tomcat",
		description:
			"一个Java Servlet容器和Web服务器，Java Web应用程序的标准部署环境.",
		icon: "logos:tomcat",
		category: "tools",
		level: "basics",
		experience: { years: 0, months: 4 },
		color: "#F8DC75",
	},
	{
		id: "linux",
		name: "Linux",
		description: "一个开源的操作系统，服务器部署和开发环境的首选选择.",
		icon: "logos:linux-tux",
		category: "tools",
		level: "beginner",
		experience: { years: 0, months: 4 },
		color: "#FCC624",
	},
	{
		id: "photoshop",
		name: "Photoshop",
		description: "专业的图像编辑和设计软件.",
		icon: "logos:adobe-photoshop",
		category: "tools",
		level: "beginner",
		experience: { years: 2, months: 6 },
		color: "#31A8FF",
	},

	// Other Skills
];

// Get skill statistics
export const getSkillStats = () => {
	const total = skillsData.length;
	const byLevel = {
		beginner: skillsData.filter((s) => s.level === "beginner").length,
		intermediate: skillsData.filter((s) => s.level === "intermediate").length,
		advanced: skillsData.filter((s) => s.level === "advanced").length,
		expert: skillsData.filter((s) => s.level === "expert").length,
	};
	const byCategory = {
		frontend: skillsData.filter((s) => s.category === "frontend").length,
		backend: skillsData.filter((s) => s.category === "backend").length,
		database: skillsData.filter((s) => s.category === "database").length,
		tools: skillsData.filter((s) => s.category === "tools").length,
		other: skillsData.filter((s) => s.category === "other").length,
	};

	return { total, byLevel, byCategory };
};

// Get skills by category
export const getSkillsByCategory = (category?: string) => {
	if (!category || category === "all") {
		return skillsData;
	}
	return skillsData.filter((s) => s.category === category);
};

// Get advanced skills
export const getAdvancedSkills = () => {
	return skillsData.filter(
		(s) => s.level === "advanced" || s.level === "expert",
	);
};

// Calculate total years of experience
export const getTotalExperience = () => {
	const totalMonths = skillsData.reduce((total, skill) => {
		return total + skill.experience.years * 12 + skill.experience.months;
	}, 0);
	return {
		years: Math.floor(totalMonths / 12),
		months: totalMonths % 12,
	};
};
