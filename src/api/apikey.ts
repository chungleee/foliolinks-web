import { Apikey } from "../types";

export const generateApiKeyAPI = async (
	domain: string
): Promise<Pick<Apikey, "apiKey" | "apikeyId" | "domain">> => {
	const url = import.meta.env.DEV
		? import.meta.env.VITE_DEV_API
		: import.meta.env.VITE_PROD_URL;

	const token = localStorage.getItem("foliolinks_access_token");

	const results = await fetch(`${url}/api/apikey/generate-api-key`, {
		method: "POST",
		body: JSON.stringify({ domain }),
		headers: {
			Authorization: `Bearer ${token}`,
			"Content-Type": "application/json",
		},
	});

	if (!results.ok) {
		let error = `Request failed with status ${results.status}`;
		try {
			const errorJson = await results.json();
			if (error && errorJson) {
				error = errorJson.error;
			}
		} catch (error) {
			console.log(error);
		}
		throw new Error(error);
	}

	const json = await results.json();
	return json;
};

export const getApiKeyAPI = async (): Promise<Apikey> => {
	const url = import.meta.env.DEV
		? import.meta.env.VITE_DEV_API
		: import.meta.env.VITE_PROD_URL;

	const token = localStorage.getItem("foliolinks_access_token");

	const results = await fetch(`${url}/api/apikey/get-api-key`, {
		method: "get",
		headers: {
			Authorization: `Bearer ${token}`,
		},
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

export const revokeApiKeyAPI = async (): Promise<{ message: string }> => {
	const url = import.meta.env.DEV
		? import.meta.env.VITE_DEV_API
		: import.meta.env.VITE_PROD_URL;

	const token = localStorage.getItem("foliolinks_access_token");

	const results = await fetch(`${url}/api/apikey/revoke-api-key`, {
		method: "post",
		headers: {
			Authorization: `Bearer ${token}`,
		},
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
