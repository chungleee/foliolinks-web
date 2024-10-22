import { useNavigate } from "react-router-dom";
import { useAuth } from "./hooks/useAuth";

function App() {
	const isAuth = useAuth();
	const navigate = useNavigate();

	if (isAuth) {
		navigate("/dashboard");
	}

	return (
		<>
			<div>...LOADING...</div>
		</>
	);
}

export default App;
