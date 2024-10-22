import { TLoginFormInputs, TRegisterFormInputs } from "../pages/Auth/model";

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

		localStorage.setItem("foliolinks_access_token", access_token);
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

	if (json.error || json.name === "AuthApiError")
		throw new Error(json.error || json.message);

	const { access_token } = await json;

	if (!access_token) throw new Error("Token not found");

	localStorage.setItem("foliolinks_access_token", access_token);

	return access_token;
};
