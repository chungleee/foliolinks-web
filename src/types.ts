export interface Project {
	id: string;
	project_name: string;
	project_url: string;
	username: string;
}

export interface ProjectErrors {
	project_name: string;
	project_url: string;
}
