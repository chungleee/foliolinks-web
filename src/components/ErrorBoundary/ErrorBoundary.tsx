import styles from "./ErrorBoundary.module.scss";
import { useNavigate, useRouteError } from "react-router-dom";
import { Button } from "../common/Button/Button";

function ErrorBoundary() {
	const error = useRouteError();
	const navigate = useNavigate();
	console.error(error);

	return (
		<div className={styles.error_boundary}>
			<div>
				<h1>Dang! Something went wrong!</h1>
				<p>
					<Button onClick={() => navigate("/")}>Go to Homepage</Button>
				</p>
			</div>
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
