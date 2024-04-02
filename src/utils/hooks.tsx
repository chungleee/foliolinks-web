import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

export const useAuth = () => {
	const [isAuthenticated, setIsAuthenticated] = useState(false);
	const navigate = useNavigate();
	const location = useLocation();
	const access_token = localStorage.getItem(
		"foliolinks_access_token"
	) as string;

	const refreshAccessToken = async () => {
		try {
			let url = import.meta.env.DEV
				? import.meta.env.VITE_DEV_API
				: import.meta.env.VITE_PROD_URL;

			const result = await fetch(`${url}/api/users/auth/refresh`, {
				method: "POST",
				credentials: "include",
			});

			const json = await result.json();

			if (json?.status === 400) {
				throw Error(json.name);
			} else {
				localStorage.setItem("foliolinks_access_token", json.access_token);
				setIsAuthenticated(true);
				navigate(location.pathname);
			}
		} catch (error) {
			console.log("refresh error: ", error);
			navigate("/login");
		}
	};

	/**
	 * When application mounts:
	 * - check if access token is present
	 * - if not, redirects to login page
	 * - if present, decode and check if token is expired:
	 * 		- if not expired, set is auth to true
	 * 		- if expired, run refresh access token function
	 */
	useEffect(() => {
		// const access_token = localStorage.getItem(
		// 	"foliolinks_access_token"
		// ) as string;

		if (!access_token) {
			setIsAuthenticated(false);
			navigate("/login");
			return;
		}
		const { exp } = jwtDecode(access_token) as { exp: number };
		const expiryDate = new Date(exp * 1000);
		const currentDate = new Date();
		const isExpired = currentDate > expiryDate;

		if (!isExpired) {
			setIsAuthenticated(true);
			return;
		}

		if (isExpired) {
			refreshAccessToken();
		}
	}, []);

	/**
	 * Hide Login and Register pages if user is already authenticated by always navigating to Dashboard page if conditions are met
	 */
	useEffect(() => {
		const authRoutes = ["/login", "/register"];
		if (isAuthenticated && authRoutes.includes(location.pathname)) {
			navigate("/dashboard");
		}

		const { exp } = jwtDecode(access_token) as { exp: number };
		const expiryDate = new Date(exp * 1000);
		const tenMinutesInMs = 10 * 60 * 1000;
		const tenMinBeforeExpiry = expiryDate.getTime() - tenMinutesInMs;
		const delay = Math.max(0, tenMinBeforeExpiry - Date.now());

		let silentRefreshTimeout = setTimeout(async () => {
			await refreshAccessToken();
		}, delay);
		return () => {
			clearTimeout(silentRefreshTimeout);
		};
	}, [isAuthenticated]);

	return isAuthenticated;
};
