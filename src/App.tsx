import { useNavigate } from "react-router-dom";
import { useAuth } from "./hooks";

function App() {
	const isAuth = useAuth();
	const navigate = useNavigate();

	if (isAuth) {
		navigate("/dashboard");
	}

	return (
		<>
			<h1>hello world</h1>
		</>
	);
}

export default App;
