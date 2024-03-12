import { ReactNode } from "react";
import styles from "./AuthLayout.module.scss";
import LogoBanner from "../../components/common/LogoBanner/LogoBanner";

const AuthLayout = ({ children }: { children: ReactNode }) => {
	return (
		<div className={styles.auth_layout}>
			<div className={styles.logo_banner}>
				<LogoBanner />
			</div>
			{children}
		</div>
	);
};

export default AuthLayout;
