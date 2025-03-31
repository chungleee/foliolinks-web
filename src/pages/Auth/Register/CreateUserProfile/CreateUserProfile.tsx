import styles from "./CreateUserProfile.module.scss";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { TUserInfoInputs, userInfoSchema } from "../../model";
import TextField from "../../../../components/common/TextField/TextField";
import { Button } from "../../../../components/common/Button/Button";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { createUserProfileAPI } from "../../../../api/user";

const CreateUserProfile = () => {
	const navigate = useNavigate();
	const {
		handleSubmit,
		register,
		formState: { errors },
	} = useForm<TUserInfoInputs>({
		resolver: zodResolver(userInfoSchema),
	});

	const [error, setError] = useState("");

	const createUserProfileMutation = useMutation({
		mutationFn: createUserProfileAPI,
		onSuccess: () => navigate("/dashboard"),
		onError: (error) => setError(error.message),
	});

	const handleSubmitUserProfile = (data: TUserInfoInputs) => {
		createUserProfileMutation.mutate(data);
	};

	return (
		<main className={styles.create_userprofile_page}>
			{createUserProfileMutation.isPending ? (
				<div>LOADING</div>
			) : (
				<>
					<section>
						<p>Let's get to know you!</p>
						<h2>Profile setup</h2>
					</section>
					<section>
						<form
							className={styles.register_page__form}
							onSubmit={handleSubmit(handleSubmitUserProfile)}
						>
							{error ? <small style={{ color: "red" }}>{error}</small> : null}
							<TextField
								{...register("firstName")}
								error={errors.firstName}
								type='text'
								label='first name'
								placeholder='John'
								className={styles.form_textfield}
							/>
							<TextField
								{...register("lastName")}
								error={errors.lastName}
								type='text'
								label='last name'
								placeholder='Doe'
							/>
							<Button variant='default'>Save</Button>
						</form>
					</section>
				</>
			)}
		</main>
	);
};

export default CreateUserProfile;
