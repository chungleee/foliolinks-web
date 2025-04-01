import { TLoginFormInputs, TRegisterFormInputs } from "../pages/Auth/model";

const url = import.meta.env.DEV
	? import.meta.env.VITE_DEV_API
	: import.meta.env.VITE_PROD_URL;

const accessTokenKeyName = import.meta.env.DEV
	? import.meta.env.VITE_DEV_ACCESS_TOKEN
	: import.meta.env.VITE_PROD_ACCESS_TOKEN;

export const handleLoginAPI = async (data: TLoginFormInputs) => {
	try {
		const url = import.meta.env.DEV
			? import.meta.env.VITE_DEV_API
			: import.meta.env.VITE_PROD_URL;

		const result = await fetch(`${url}/api/users/auth/login`, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(data),
			credentials: "include",
		});

		const json = await result.json();
		const { access_token } = await json;

		localStorage.setItem(accessTokenKeyName, access_token);
	} catch (error) {
		console.log(error);
	}
};

export const handleRegisterAPI = async (data: TRegisterFormInputs) => {
	const url = import.meta.env.DEV
		? import.meta.env.VITE_DEV_API
		: import.meta.env.VITE_PROD_URL;

	const result = await fetch(`${url}/api/users/auth/register`, {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(data),
		credentials: "include",
	});

	const json = await result.json();

	if (json.errorCode) {
		throw json;
	}

	const { access_token } = await json;

	if (!access_token) throw new Error("Token not found");

	localStorage.setItem(accessTokenKeyName, access_token);

	return access_token;
};

export const handleLogoutAPI = async () => {
	const token = localStorage.getItem(accessTokenKeyName);

	const result = await fetch(`${url}/api/users/auth/logout`, {
		method: "POST",
		headers: {
			Authorization: `Bearer ${token}`,
		},
	});

	const json = await result.json();

	if (json.loggedOut) {
		localStorage.removeItem(accessTokenKeyName);
	}

	return json;
};

export const handleDeleteAccountAPI = async () => {
	const token = localStorage.getItem(accessTokenKeyName);

	const results = await fetch(`${url}/api/users/auth/delete-account`, {
		method: "POST",
		headers: {
			Authorization: `Bearer ${token}`,
		},
		credentials: "include",
	});

	if (!results.ok) {
		let error = `Request failed with status ${results.status}`;
		try {
			const errorJson = await results.json();
			if (error && errorJson) {
				error = errorJson.message;
			}
		} catch (error) {
			console.log(error);
		}
		throw new Error(error);
	}

	const json = await results.json();

	return json;
};
