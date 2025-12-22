// Album and Photo type definitions

export interface Photo {
	id: string;
	src: string;
	thumbnail?: string;
	alt: string;
	title?: string;
	description?: string;
	tags: string[];
	date: string;
	location?: string;
	width?: number;
	height?: number;
	camera?: string;
	lens?: string;
	settings?: any;
	url?: string; // For admin API response
}

export interface AlbumGroup {
	id: string;
	title: string;
	description: string;
	cover: string;
	date: string;
	location: string;
	tags: string[];
	layout: string;
	columns: number;
	photos: Photo[];
	// Additional fields that might be used in admin API response
	createdAt?: string;
	updatedAt?: string;
}
