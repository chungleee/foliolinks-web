import { ReactNode } from "react";
import { useAuth } from "../hooks";

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
