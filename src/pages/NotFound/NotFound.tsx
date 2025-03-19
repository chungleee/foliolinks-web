import styles from "./NotFound.module.scss";
import { useNavigate } from "react-router-dom";
import { Button } from "../../components/common/Button/Button";

const NotFound = () => {
	const navigate = useNavigate();
	return (
		<div className={styles.error_notfound}>
			<p>Oops, this page doesn't exist!</p>
			<Button onClick={() => navigate("/")}>Go back to Homepage</Button>
		</div>
	);
};

export default NotFound;
