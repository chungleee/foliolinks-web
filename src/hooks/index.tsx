import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

export const useAuth = () => {
	const [isAuthenticated, setIsAuthenticated] = useState(false);
	const navigate = useNavigate();

	const refreshAccessToken = async () => {
		try {
			let url = "https://foliolinks-api.leonchung.ca";
			const result = await fetch(`${url}/api/users/auth/refresh`, {
				method: "POST",
				credentials: "include",
			});

			const json = await result.json();

			console.log("refresh json: ", json);
			if (json?.status === 400) {
				throw Error(json.name);
			}
		} catch (error) {
			console.log("refresh error: ", error);
			navigate("/login");
		}
	};

	useEffect(() => {
		const access_token = localStorage.getItem("foliolinks_access_token");

		if (!access_token) {
			setIsAuthenticated(false);
			navigate("/login");
		} else {
			const { exp } = jwtDecode(access_token) as { exp: number };
			const expiryDate = new Date(exp * 1000);
			const currentDate = new Date();
			console.log("expiryDate: ", expiryDate);
			console.log("current: ", new Date());

			const isExpired = currentDate > expiryDate;

			if (!isExpired) {
				setIsAuthenticated(true);
				return;
			}

			if (isExpired) {
				refreshAccessToken();
			}
		}
	}, []);

	return isAuthenticated;
};
