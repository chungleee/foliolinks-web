import styles from "./Snackbar.module.scss";

interface SnackbackProps {
	message: string;
	handleOnClose: () => void;
}

const Snackbar = ({ message, handleOnClose }: SnackbackProps) => {
	return (
		<div className={styles.snackbar}>
			{message} <button onClick={handleOnClose}>x</button>
		</div>
	);
};

export default Snackbar;
