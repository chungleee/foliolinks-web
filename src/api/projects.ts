import { Project } from "../types";
import { TCreateLinksValues } from "../zod";

const accessTokenKeyName = import.meta.env.DEV
	? import.meta.env.VITE_DEV_ACCESS_TOKEN
	: import.meta.env.VITE_PROD_ACCESS_TOKEN;

export const getProjectsAPI = async (): Promise<Project[]> => {
	const url = import.meta.env.DEV
		? import.meta.env.VITE_DEV_API
		: import.meta.env.VITE_PROD_URL;

	const token = localStorage.getItem(accessTokenKeyName);

	const results = await fetch(`${url}/api/users/projects`, {
		method: "get",
		headers: {
			Authorization: `Bearer ${token}`,
		},
	});

	const json = await results.json();

	return json.projects;
};

export const createProjectsAPI = async (
	data: TCreateLinksValues["projects"]
) => {
	const url = import.meta.env.DEV
		? import.meta.env.VITE_DEV_API
		: import.meta.env.VITE_PROD_URL;

	const token = localStorage.getItem(accessTokenKeyName);
	try {
		const result = await fetch(`${url}/api/users/projects`, {
			method: "POST",
			body: JSON.stringify({ projects: data }),
			headers: {
				Authorization: `Bearer ${token}`,
				"Content-Type": "application/json",
			},
		});

		const json = await result.json();
		return json.projects;
	} catch (error) {
		console.log("error: ", error);
	}
};

export const deleteProjectAPI = async (project: Project) => {
	const url = import.meta.env.DEV
		? import.meta.env.VITE_DEV_API
		: import.meta.env.VITE_PROD_URL;

	const token = localStorage.getItem(accessTokenKeyName);

	try {
		const result = await fetch(`${url}/api/users/projects/${project.id}`, {
			method: "DELETE",
			body: JSON.stringify({
				project,
			}),
			headers: {
				Authorization: `Bearer ${token}`,
				"Content-Type": "application/json",
			},
		});
		const json = await result.json();

		return {
			project: json.project,
		};
	} catch (error) {
		console.log("error: ", error);
	}
};

export const updateProjectAPI = async (project: Project) => {
	const url = import.meta.env.DEV
		? import.meta.env.VITE_DEV_API
		: import.meta.env.VITE_PROD_URL;

	const token = localStorage.getItem(accessTokenKeyName);
	try {
		const result = await fetch(`${url}/api/users/projects/`, {
			method: "PATCH",
			body: JSON.stringify({
				updateProject: project,
			}),
			headers: {
				Authorization: `Bearer ${token}`,
				"Content-Type": "application/json",
			},
		});

		const json = await result.json();

		return json.updatedProject;
	} catch (error) {
		console.log("error: ", error);
	}
};
