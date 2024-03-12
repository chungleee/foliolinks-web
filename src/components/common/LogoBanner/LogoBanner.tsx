import Icon from "../Icon";
import styles from "./LogoBanner.module.scss";

const Logo = () => {
	return (
		<div className={styles.logo__icon}>
			<Icon variant='link' />
		</div>
	);
};

interface LogoBannerProps {
	logoTextClassName?: string;
}

const LogoBanner = ({ logoTextClassName }: LogoBannerProps) => {
	<div className={styles.logo}>
		<Logo />
		<span className={`${styles.logo__text} ${logoTextClassName}`}>
			foliolinks
		</span>
	</div>;
};

export default LogoBanner;
