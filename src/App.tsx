import { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "./contexts/AuthContext";

function App() {
	const navigate = useNavigate();
	const { isAuthenticated } = useContext(AuthContext);

	useEffect(() => {
		if (isAuthenticated) {
			navigate("/dashboard");
		}
	}, [isAuthenticated, navigate]);

	return (
		<>
			<div>...LOADING...</div>
		</>
	);
}

export default App;
