import { createContext, ReactNode } from "react";
import { Apikey, UserProfile } from "../types";
import { useQuery } from "@tanstack/react-query";
import { getUserProfileAPI } from "../api/user";
import { getApiKeyAPI } from "../api/apikey";

interface UserContextType {
	userProfile: UserProfile | undefined;
	isUserPending: boolean;
	isProfileComplete: boolean;
	userApiKey?: Apikey;
}

export const UserContext = createContext<UserContextType>({
	userProfile: undefined,
	isUserPending: true,
	isProfileComplete: false,
	userApiKey: undefined,
});

export const UserProvider = ({ children }: { children: ReactNode }) => {
	const { data: userProfileData, isPending: isUserPending } = useQuery({
		queryKey: ["userProfile"],
		queryFn: getUserProfileAPI,
	});
	const { username, firstName, lastName, membership } = userProfileData || {};
	const isProfileComplete = !!username || !!firstName || !!lastName;

	const { data: userApiKeyData } = useQuery({
		queryKey: ["userApiKey"],
		queryFn: getApiKeyAPI,
		enabled: membership === "PRO",
		retry: false,
	});

	return (
		<UserContext.Provider
			value={{
				userProfile: userProfileData,
				isUserPending,
				isProfileComplete,
				userApiKey: userApiKeyData,
			}}
		>
			{children}
		</UserContext.Provider>
	);
};
