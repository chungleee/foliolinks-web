import { useRouteError } from "react-router-dom";

function ErrorBoundary() {
	let error = useRouteError();
	console.error(error);

	return (
		<div>
			<h1>Dang! Something went wrong</h1>
			<p>
				<a href='/dashboard'>Go to Homepage</a>
			</p>
			{process.env.NODE_ENV === "development" && (
				<div>
					<h2>Error Details (Development Only)</h2>
					<p>{error?.toString()}</p>
				</div>
			)}
		</div>
	);
}

export default ErrorBoundary;
