export interface Project {
	id: string;
	project_name: string;
	project_description: string;
	project_url: string;
	username: string;
}

export type CreateProjects = Pick<Project, "project_name" | "project_url">[];

export interface ProjectErrors {
	project_name: string;
	project_url: string;
}

export interface UserProfile {
	firstName: string;
	lastName: string;
	username: string;
	membership: UserMembership;
	email: string;
}

export type UserMembership = "BASIC" | "PRO";
