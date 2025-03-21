import styles from "./Settings.module.scss";
import DashboardLayout from "../DashboardLayout";
import TextField from "../../../components/common/TextField/TextField";
import { Button } from "../../../components/common/Button/Button";
import { generateApiKeyAPI, revokeApiKeyAPI } from "../../../api/apikey";
import { useForm } from "react-hook-form";
import { apikeyFormSchema, TApikeyFormValues } from "../../../zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { RefObject, useContext, useEffect, useRef, useState } from "react";
import { UserContext } from "../../../contexts/UserContext";
import { handleDeleteAccountAPI } from "../../../api/auth";
import { useNavigate } from "react-router-dom";
import Icon from "../../../components/common/Icon";

const Settings = () => {
	const [revokeMsg, setRevokeMsg] = useState<{
		success?: string;
		error?: string;
	}>({ success: "", error: "" });

	const { userApiKey, userProfile } = useContext(UserContext);
	const navigate = useNavigate();
	const queryClient = useQueryClient();
	const dialogRef = useRef<HTMLDialogElement>(null);

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
		onSuccess: ({ apiKey, apikeyId, domain }) => {
			queryClient.setQueryData(["userApiKey"], { apiKey, apikeyId, domain });
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
			queryClient.setQueriesData({ queryKey: ["userApiKey"] }, {});
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

	const handleShowWarningModal = () => {
		dialogRef.current?.showModal();
	};

	const deleteAccountMutation = useMutation({
		mutationFn: handleDeleteAccountAPI,
		onSuccess: () => {
			queryClient.clear();
			localStorage.removeItem("foliolinks_access_token");
			navigate("/");
		},
		onError: (error) => {
			throw new Error(error.message);
		},
	});

	const handleDeleteAccount = () => {
		deleteAccountMutation.mutate();
	};

	const isMemberPro = userProfile?.membership === "PRO";

	return (
		<DashboardLayout>
			<div className={styles.settings}>
				<DeleteWarningModal
					dialogRef={dialogRef}
					handleDeleteAccount={handleDeleteAccount}
				/>
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
						<h3>API key</h3>
						<TextField
							label='Domain'
							placeholder='Enter your domain'
							{...register("domain")}
							error={errors.domain}
							readonly={domain ? true : false}
						/>
						<TextField
							label='API key ID'
							error={errors.apikeyId}
							{...register("apikey")}
							readonly={true}
							type={apiKey ? "password" : "text"}
						/>
						<TextField
							label='API key'
							error={errors.apikey}
							{...register("apikeyId")}
							type={apikeyId ? "password" : "text"}
							readonly={true}
						/>
						{revokeMsg.success && (
							<small className={styles.success}>{revokeMsg.success}</small>
						)}
						{revokeMsg.error && (
							<small className={styles.error}>{revokeMsg.error}</small>
						)}
						<div className={styles.settings__main_apiBtns}>
							<Button
								disabled={!isMemberPro}
								type='submit'
								title={!isMemberPro ? "You need a PRO membership" : undefined}
							>
								Generate
							</Button>
							<Button
								disabled={!isMemberPro}
								type='button'
								variant='secondary'
								onClick={handleRevokeApiKey}
								title={!isMemberPro ? "You need a PRO membership" : undefined}
							>
								Revoke
							</Button>
						</div>
					</form>
				</section>
				<section>
					<h3>Account Deletion</h3>
					<Button type='button' onClick={() => handleShowWarningModal()}>
						Delete Account
					</Button>
				</section>
			</div>
		</DashboardLayout>
	);
};

export default Settings;

interface DeleteWarningModalProps {
	dialogRef: RefObject<HTMLDialogElement>;
	handleDeleteAccount: () => void;
}

const DeleteWarningModal = ({
	dialogRef,
	handleDeleteAccount,
}: DeleteWarningModalProps) => {
	const [confirmValue, setConfirmValue] = useState("");

	const handleCloseWarningModal = () => {
		dialogRef.current?.close();
	};

	const deleteConfirmed = !(confirmValue === "confirm");

	return (
		<dialog ref={dialogRef}>
			<span
				onClick={() => handleCloseWarningModal()}
				className={styles.dialog__exitIcon}
				role='button'
			>
				<Icon style={{ height: "25px", width: "25px" }} variant='close' />
			</span>
			<div className={styles.dialog__content}>
				<div>
					<h3>Are you sure?</h3>
					<h4>Please type 'confirm' to delete your account.</h4>
					<TextField
						value={confirmValue}
						onChange={(e) => setConfirmValue(e.target.value)}
					/>
				</div>
				<div className={styles.dialog__actionBtns}>
					<Button
						disabled={deleteConfirmed}
						onClick={() => handleDeleteAccount()}
					>
						Confirm
					</Button>
					<Button onClick={() => handleCloseWarningModal()}>Cancel</Button>
				</div>
			</div>
		</dialog>
	);
};
