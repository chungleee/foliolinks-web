import { Outlet } from "react-router-dom";
import AuthLayout from "../AuthLayout";

const Register = () => {
	return (
		<AuthLayout>
			<Outlet />
		</AuthLayout>
	);
};

export default Register;
