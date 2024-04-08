import { create } from "zustand";

interface Project {
	id: string;
	project_name: string;
	project_url: string;
}

interface UserData {
	email: string;
	id: string;
	role: string;
	userProfile: {
		id: string;
		email: string;
		firstName: string;
		lastName: string;
		membership: "BASIC" | "PRO";
		projects: Project[];
		user_id: string;
		username: string;
	};
}

interface StoreState {
	authenticatedUser: UserData | null;
	setAuthenticatedUser: (userData: UserData) => void;
	projects: Project[];
	setProjects: (projects: Project[]) => void;
}

export const useStore = create<StoreState>()((set, get) => {
	return {
		authenticatedUser: null,
		setAuthenticatedUser: (userData) => {
			return set({ authenticatedUser: userData });
		},
		projects: [],
		setProjects: (projectsArray) => {
			const updatedProjects = projectsArray.reduce((acc, project) => {
				const existingProject = get().projects.find((p) => {
					return p.id === project.id;
				});
				if (!existingProject) {
					acc.push(project);
				}
				return acc;
			}, [] as Project[]);
			console.log("updatedProjects: ", updatedProjects);
			return set({ projects: updatedProjects });
		},
	};
});
