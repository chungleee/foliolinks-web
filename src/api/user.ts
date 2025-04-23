import { UserProfile } from "../types";

const accessTokenKeyName = import.meta.env.DEV
	? import.meta.env.VITE_DEV_ACCESS_TOKEN
	: import.meta.env.VITE_PROD_ACCESS_TOKEN;

export const getUserProfileAPI = async (): Promise<UserProfile | undefined> => {
	const token = localStorage.getItem(accessTokenKeyName);
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
	data: FormData
): Promise<UserProfile | undefined> => {
	const token = localStorage.getItem(accessTokenKeyName);
	// if (!token) return;
	try {
		const url = import.meta.env.DEV
			? import.meta.env.VITE_DEV_API
			: import.meta.env.VITE_PROD_URL;

		const result = await fetch(`${url}/api/users/profile/create`, {
			method: "POST",
			body: data,
			headers: {
				Authorization: `Bearer ${token}`,
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
