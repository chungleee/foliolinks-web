export interface Project {
	id: string;
	project_name: string;
	project_description?: string;
	project_url: string;
	username: string;
}

export type CreateProjects = Pick<Project, "project_name" | "project_url">[];

export interface ProjectErrors {
	project_name: string;
	project_url: string;
	project_description: string;
}

export interface UserProfile {
	id: string;
	firstName: string;
	lastName: string;
	username: string;
	membership: UserMembership;
	email: string;
	avatar: string | null;
}

export type UserMembership = "BASIC" | "PRO";

export interface Apikey {
	apiKey: string;
	apikeyId: string;
	domain: string;
	isRevoked: boolean;
}
