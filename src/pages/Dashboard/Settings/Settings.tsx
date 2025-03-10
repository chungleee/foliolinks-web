import styles from "./Settings.module.scss";
import DashboardLayout from "../DashboardLayout";
import TextField from "../../../components/common/TextField/TextField";
import { Button } from "../../../components/common/Button/Button";

const Settings = () => {
	const handleGenerateApiKey = () => {
		console.log("generating api key");
	};

	const handleRevokeApiKey = () => {
		console.log("revoking api key");
	};
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

				<section className={styles.settings__main}>
					<TextField label='API key' />
					<div className={styles.settings__main_apiBtns}>
						<Button onClick={handleGenerateApiKey}>Generate</Button>
						<Button onClick={handleRevokeApiKey}>Revoke</Button>
					</div>
				</section>
			</div>
		</DashboardLayout>
	);
};

export default Settings;
