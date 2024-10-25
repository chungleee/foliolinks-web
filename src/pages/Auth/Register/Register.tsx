import { Outlet } from "react-router-dom";

import AuthLayout from "../AuthLayout";
import { useAuth } from "../../../hooks/useAuth";

const Register = () => {
	useAuth();

	return (
		<AuthLayout>
			<Outlet />
		</AuthLayout>
	);
};

export default Register;
