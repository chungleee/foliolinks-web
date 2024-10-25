import { createContext, ReactNode } from "react";
import { UserProfile } from "../types";
// import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getUserProfileAPI } from "../api/user";

interface UserContextType {
	userProfile: UserProfile | undefined;
	isUserPending: boolean;
}

export const UserContext = createContext<UserContextType>({
	userProfile: undefined,
	isUserPending: true,
});

export const UserProvider = ({ children }: { children: ReactNode }) => {
	const { data, isPending: isUserPending } = useQuery({
		queryKey: ["userProfile"],
		queryFn: getUserProfileAPI,
	});

	return (
		<UserContext.Provider value={{ userProfile: data, isUserPending }}>
			{children}
		</UserContext.Provider>
	);
};
