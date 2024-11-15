import { createContext, ReactNode } from "react";
import { UserProfile } from "../types";
// import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getUserProfileAPI } from "../api/user";

interface UserContextType {
	userProfile: UserProfile | undefined;
	isUserPending: boolean;
	isProfileComplete: boolean;
}

export const UserContext = createContext<UserContextType>({
	userProfile: undefined,
	isUserPending: true,
	isProfileComplete: false,
});

export const UserProvider = ({ children }: { children: ReactNode }) => {
	const { data, isPending: isUserPending } = useQuery({
		queryKey: ["userProfile"],
		queryFn: getUserProfileAPI,
	});
	const { username, firstName, lastName } = data || {};
	const isProfileComplete = !!username || !!firstName || !!lastName;

	return (
		<UserContext.Provider
			value={{ userProfile: data, isUserPending, isProfileComplete }}
		>
			{children}
		</UserContext.Provider>
	);
};
