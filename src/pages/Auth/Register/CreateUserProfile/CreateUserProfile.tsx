import styles from "./CreateUserProfile.module.scss";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigate } from "react-router-dom";
import { TUserInfoInputs, userInfoSchema } from "../../model";
import TextField from "../../../../components/common/TextField/TextField";
import Button from "../../../../components/common/Button/Button";
import { useAuth } from "../../../../hooks/useAuth";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { handleRegisterAPI } from "../../../../api/auth";

const CreateUserProfile = () => {
	useAuth();
	const navigate = useNavigate();
	const {
		handleSubmit,
		register,
		formState: { errors },
	} = useForm<TUserInfoInputs>({
		resolver: zodResolver(userInfoSchema),
	});

	const [error, setError] = useState("");

	// const registerMutation = useMutation({
	// 	mutationFn: handleRegisterAPI,
	// 	onSuccess: () => {
	// 		navigate("userinfo");
	// 	},
	// 	onError: (error) => {
	// 		setError(error.message);
	// 	},
	// });

	const handleSubmitUserProfile = (data: TUserInfoInputs) => {
		console.log("user profile data: ", data);
		navigate("/dashboard");
	};

	return (
		<main className={styles.create_userprofile_page}>
			{false ? (
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
							<TextField
								{...register("username")}
								error={errors.username}
								label='username'
								placeholder='johndoe'
							/>
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
