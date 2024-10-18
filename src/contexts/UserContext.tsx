import { createContext, ReactNode, useEffect, useState } from "react";
import { UserProfile } from "../types";

export const UserContext = createContext<{ userProfile: UserProfile | null }>({
	userProfile: null,
});

export const UserProvider = ({ children }: { children: ReactNode }) => {
	const [userProfile, setUserProfile] = useState<UserProfile | null>(null);

	useEffect(() => {
		const getUserProfile = async () => {
			const token = localStorage.getItem("foliolinks_access_token");
			if (!token) return;
			try {
				const url = import.meta.env.DEV
					? import.meta.env.VITE_DEV_API
					: import.meta.env.VITE_PROD_URL;

				const result = await fetch(`${url}/api/users/profile/me`, {
					method: "GET",
					headers: {
						Authorization: `Bearer ${token}`,
						"Content-Type": "application/json",
					},
					credentials: "include",
				});

				const json = await result.json();
				setUserProfile(json.data);
			} catch (error) {
				console.log(error);
			}
		};

		getUserProfile();
	}, []);

	return (
		<UserContext.Provider value={{ userProfile }}>
			{children}
		</UserContext.Provider>
	);
};
