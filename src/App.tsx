import { useAuth } from "./hooks";

function App() {
	const user = useAuth();

	return (
		<>
			<h1>hello world</h1>
		</>
	);
}

export default App;
