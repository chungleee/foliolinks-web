import { useAuth } from "./hooks";

function App() {
	useAuth();

	return (
		<>
			<h1>hello world</h1>
		</>
	);
}

export default App;
