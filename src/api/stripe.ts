import { UserProfile } from "../types";

export const stripeCheckoutSessionPromiseAPI = async (): Promise<{
	clientSecret: string;
	checkoutSessionId: string;
}> => {
	const url = import.meta.env.DEV
		? import.meta.env.VITE_DEV_API
		: import.meta.env.VITE_PROD_URL;

	const accessTokenKeyName = import.meta.env.DEV
		? import.meta.env.VITE_DEV_ACCESS_TOKEN
		: import.meta.env.VITE_PROD_ACCESS_TOKEN;

	const token = localStorage.getItem(accessTokenKeyName);

	const result = await fetch(`${url}/api/payment/create-checkout-session`, {
		method: "POST",
		headers: {
			Authorization: `Bearer ${token}`,
		},
	});

	const data = await result.json();

	return {
		clientSecret: data.clientSecret,
		checkoutSessionId: data.checkoutSessionId,
	};
};

export const stripeRemoveCheckoutSessionAPI = async (
	sessionId: string
): Promise<string> => {
	const url = import.meta.env.DEV
		? import.meta.env.VITE_DEV_API
		: import.meta.env.VITE_PROD_URL;

	const accessTokenKeyName = import.meta.env.DEV
		? import.meta.env.VITE_DEV_ACCESS_TOKEN
		: import.meta.env.VITE_PROD_ACCESS_TOKEN;

	const token = localStorage.getItem(accessTokenKeyName);

	const result = await fetch(`${url}/api/payment/remove-checkout-session`, {
		method: "POST",
		headers: {
			Authorization: `Bearer ${token}`,
			"Content-Type": "application/json",
		},
		body: JSON.stringify({
			sessionToExpire: sessionId,
		}),
	});

	const data = await result.json();

	return data.status;
};

export const handleUpgradeMembership = async (): Promise<{
	type: "success" | "error";
	userProfile: UserProfile;
}> => {
	const url = import.meta.env.DEV
		? import.meta.env.VITE_DEV_API
		: import.meta.env.VITE_PROD_URL;

	const accessTokenKeyName = import.meta.env.DEV
		? import.meta.env.VITE_DEV_ACCESS_TOKEN
		: import.meta.env.VITE_PROD_ACCESS_TOKEN;

	const token = localStorage.getItem(accessTokenKeyName);

	const result = await fetch(`${url}/api/payment/upgrade-membership`, {
		method: "POST",
		headers: {
			Authorization: `Bearer ${token}`,
			"Content-Type": "application/json",
		},
	});

	const data = await result.json();

	return data;
};
