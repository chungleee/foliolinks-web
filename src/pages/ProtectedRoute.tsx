import { ReactNode, useEffect } from "react";
import { useAuth } from "../utils/hooks";

interface Props {
	children: ReactNode;
}

const ProtectedRoute = ({ children }: Props) => {
	const isAuth = useAuth();

	if (!isAuth) {
		return <p>Not authenticated</p>;
	}

	return <>{children}</>;
};

export default ProtectedRoute;
