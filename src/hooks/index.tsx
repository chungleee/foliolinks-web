import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

interface User {
	id: string;
	username: string;
}

export const useAuth = () => {
	const navigate = useNavigate();
	const [user] = useState<User | null>(null);

	useEffect(() => {
		if (!user) {
			navigate("/login");
		}
	}, []);

	return { user } as const;
};
