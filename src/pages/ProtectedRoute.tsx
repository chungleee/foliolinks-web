import { ReactNode } from "react";
import { useAuth } from "../utils/hooks";

interface Props {
	children: ReactNode;
}

const ProtectedRoute = ({ children }: Props) => {
	useAuth();

	return <>{children}</>;
};

export default ProtectedRoute;
