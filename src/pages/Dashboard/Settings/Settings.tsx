import styles from "./Settings.module.scss";
import DashboardLayout from "../DashboardLayout";

const Settings = () => {
	return (
		<DashboardLayout>
			<div className={styles.settings}>
				<section className={styles.settings__intro}>
					<p>
						Here you can manage your membership tier, generate your API key and
						account deletion.
					</p>
					<h2>Account Settings</h2>
				</section>
			</div>
		</DashboardLayout>
	);
};

export default Settings;
