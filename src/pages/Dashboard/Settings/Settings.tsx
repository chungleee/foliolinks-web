import styles from "./Settings.module.scss";
import DashboardLayout from "../DashboardLayout";
import TextField from "../../../components/common/TextField/TextField";
import { Button } from "../../../components/common/Button/Button";
import { generateApiKeyAPI } from "../../../api/apikey";
import { useForm } from "react-hook-form";
import { apikeyFormSchema, TApikeyFormValues } from "../../../zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";

const Settings = () => {
	const {
		handleSubmit,
		register,
		formState: { errors },
		setError,
	} = useForm<TApikeyFormValues>({
		resolver: zodResolver(apikeyFormSchema),
	});

	const generateApiKeyAPIMutation = useMutation({
		mutationFn: generateApiKeyAPI,
		onError: (error) => {
			console.log(error.message);
			setError("apikey", { message: error.message });
		},
	});

	const handleGenerateApiKey = ({ domain }: TApikeyFormValues) => {
		generateApiKeyAPIMutation.mutate(domain);
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

				<section>
					<form
						className={styles.settings__main}
						onSubmit={handleSubmit(handleGenerateApiKey)}
					>
						<TextField
							label='Domain'
							placeholder='Enter your domain'
							{...register("domain")}
							error={errors.domain}
						/>
						<TextField label='API key' error={errors.apikey} />
						<div className={styles.settings__main_apiBtns}>
							<Button type='submit'>Generate</Button>
							<Button type='button' onClick={handleRevokeApiKey}>
								Revoke
							</Button>
						</div>
					</form>
				</section>
			</div>
		</DashboardLayout>
	);
};

export default Settings;
