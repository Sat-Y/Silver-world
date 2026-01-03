// Project data configuration file
// Used to manage data for the project display page

export interface Project {
	id: string;
	title: string;
	description: string;
	image: string;
	category: "web" | "mobile" | "desktop" | "other";
	techStack: string[];
	status: "completed" | "in-progress" | "planned";
	liveDemo?: string;
	sourceCode?: string;
	startDate: string;
	endDate?: string;
	featured?: boolean;
	tags?: string[];
}

export const projectsData: Project[] = [
	{
		id: "zyh-world",
		title: "zyh's world",
		description: "我的个人博客项目，基于GitHub社区Mizuki的blog进行学习修改",
		image: "",
		category: "web",
		techStack: [
			"Astro",
			"TypeScript",
			"Tailwind CSS",
			"Svelte",
			"java",
			"tomcat",
		],
		status: "completed",
		liveDemo: "https://silver-z.netlify.app",
		sourceCode: "https://github.com/Sat-Y/Silver-world",
		startDate: "2025-09-22",
		endDate: "2025-10-30",
		featured: true,
		tags: ["Blog", "Theme", "Open Source"],
	},
	{
		id: "路边一条",
		title: "路边一条的游戏",
		description: "我因兴趣制作了一个简单的游戏，2d横板闯关游戏，像素风",
		image: "",
		category: "游戏制作",
		techStack: [
			"GDscript",
			"GoDot",
		],
		status: "completed",
		startDate: "2025-07-18",
		endDate: "2025-9-1",
		featured: true,
		tags: ["Game", "GoDot", "GDscript"],
	},
];

// Get project statistics
export const getProjectStats = () => {
	const total = projectsData.length;
	const completed = projectsData.filter((p) => p.status === "completed").length;
	const inProgress = projectsData.filter(
		(p) => p.status === "in-progress",
	).length;
	const planned = projectsData.filter((p) => p.status === "planned").length;

	return {
		total,
		byStatus: {
			completed,
			inProgress,
			planned,
		},
	};
};

// Get projects by category
export const getProjectsByCategory = (category?: string) => {
	if (!category || category === "all") {
		return projectsData;
	}
	return projectsData.filter((p) => p.category === category);
};

// Get featured projects
export const getFeaturedProjects = () => {
	return projectsData.filter((p) => p.featured);
};

// Get all tech stacks
export const getAllTechStack = () => {
	const techSet = new Set<string>();
	projectsData.forEach((project) => {
		project.techStack.forEach((tech) => techSet.add(tech));
	});
	return Array.from(techSet).sort();
};
