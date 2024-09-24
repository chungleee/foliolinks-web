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

export interface UserProfile {
	firstName: string;
	lastName: string;
	username: string;
	membership: string;
	email: string;
}
