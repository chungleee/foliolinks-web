import { create } from "zustand";

interface Project {
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
	updateAuthedUser: (userData: UserData) => void;
}

export const useStore = create<StoreState>()((set) => {
	return {
		authenticatedUser: null,
		updateAuthedUser: (userData) => {
			return set({ authenticatedUser: userData });
		},
	};
});
