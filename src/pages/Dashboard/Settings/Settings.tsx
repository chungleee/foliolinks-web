import styles from "./Settings.module.scss";
import DashboardLayout from "../DashboardLayout";
import TextField from "../../../components/common/TextField/TextField";
import { Button } from "../../../components/common/Button/Button";
import { generateApiKeyAPI, revokeApiKeyAPI } from "../../../api/apikey";
import { useForm } from "react-hook-form";
import { apikeyFormSchema, TApikeyFormValues } from "../../../zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useContext, useEffect, useState } from "react";
import { UserContext } from "../../../contexts/UserContext";

const Settings = () => {
	const [revokeMsg, setRevokeMsg] = useState<{
		success?: string;
		error?: string;
	}>({ success: "", error: "" });
	const { userApiKey } = useContext(UserContext);
	const { apiKey, apikeyId, domain, isRevoked } = userApiKey || {};
	const {
		handleSubmit,
		register,
		formState: { errors },
		setError,
		setValue,
		reset,
	} = useForm<TApikeyFormValues>({
		resolver: zodResolver(apikeyFormSchema),
	});

	useEffect(() => {
		if (!isRevoked) {
			if (apiKey) setValue("apikey", apiKey);
			if (apikeyId) setValue("apikeyId", apikeyId);
			if (domain) setValue("domain", domain);
		}
	}, [isRevoked, apiKey, apikeyId, domain, setValue]);

	const generateApiKeyAPIMutation = useMutation({
		mutationFn: generateApiKeyAPI,
		onSuccess: ({ apiKey, apikeyId }) => {
			setValue("apikey", apiKey);
			setValue("apikeyId", apikeyId);
		},
		onError: (error) => {
			setError("apikey", { message: error.message });
		},
	});

	const handleGenerateApiKey = ({ domain }: TApikeyFormValues) => {
		generateApiKeyAPIMutation.mutate(domain);
	};

	const revokeApiKeyAPIMutation = useMutation({
		mutationFn: revokeApiKeyAPI,
		onSuccess: ({ message }) => {
			reset();
			setRevokeMsg((prev) => {
				return {
					...prev,
					success: message,
				};
			});

			setTimeout(() => {
				setRevokeMsg({});
			}, 5000);
		},
		onError: (error) => {
			console.log(error);
			setRevokeMsg((prev) => {
				return {
					...prev,
					error: error.message,
				};
			});
			setTimeout(() => {
				setRevokeMsg({});
			}, 5000);
		},
	});

	const handleRevokeApiKey = () => {
		revokeApiKeyAPIMutation.mutate();
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
							readonly={domain ? "readonly" : undefined}
						/>
						<TextField
							label='API key ID'
							error={errors.apikeyId}
							{...register("apikey")}
							readonly='readonly'
						/>
						<TextField
							label='API key'
							error={errors.apikey}
							{...register("apikeyId")}
							readonly='readonly'
						/>
						{revokeMsg.success && (
							<small className={styles.success}>{revokeMsg.success}</small>
						)}
						{revokeMsg.error && (
							<small className={styles.error}>{revokeMsg.error}</small>
						)}
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
