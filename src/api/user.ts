import { UserProfile } from "../types";

export const getUserProfileAPI = async (): Promise<UserProfile | undefined> => {
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

		return json.data;
	} catch (error) {
		console.log(error);
	}
};

export const createUserProfileAPI = async (
	data: Pick<UserProfile, "firstName" | "lastName">
): Promise<UserProfile | undefined> => {
	const token = localStorage.getItem("foliolinks_access_token");
	// if (!token) return;

	try {
		const url = import.meta.env.DEV
			? import.meta.env.VITE_DEV_API
			: import.meta.env.VITE_PROD_URL;

		const result = await fetch(`${url}/api/users/profile/create`, {
			method: "POST",
			body: JSON.stringify(data),
			headers: {
				Authorization: `Bearer ${token}`,
				"Content-Type": "application/json",
			},
		});

		if (!result.ok) {
			let error = `Request failed with status ${result.status}`;
			try {
				const errorJson = await result.json();
				if (error && errorJson) {
					error = errorJson.error;
				}
			} catch (error) {
				console.log(error);
			}
			throw new Error(error);
		}

		const json = await result.json();
		if (json.error) throw new Error(json.error);

		return json.data;
	} catch (error) {
		if (error instanceof Error) throw new Error(error.message);
	}
};
