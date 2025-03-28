import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";

import styles from "./CreateUserAccount.module.scss";

import TextField from "../../../../components/common/TextField/TextField";
import { Button } from "../../../../components/common/Button/Button";

import { TRegisterFormInputs, registerSchema } from "../../model";
import { handleRegisterAPI } from "../../../../api/auth";

const CreateUserAccount = () => {
	const navigate = useNavigate();
	const {
		handleSubmit,
		register,
		formState: { errors },
		setError,
	} = useForm<TRegisterFormInputs>({
		resolver: zodResolver(registerSchema),
	});

	const registerMutation = useMutation({
		mutationFn: handleRegisterAPI,
		onSuccess: () => {
			navigate("userinfo");
		},
		onError: (error: { error: string; errorCode: string }) => {
			switch (error.errorCode) {
				case "USERNAME_TAKEN":
					setError("username", { message: error.error });
					break;

				case "SIGNUP_FAILED":
					setError("email", { message: error.error });
					break;

				case "AuthApiError":
					setError("email", { message: error.error });
					break;

				default:
					console.log(error);
			}
		},
	});

	const onRegisterSubmit = (data: TRegisterFormInputs) => {
		registerMutation.mutate(data);
	};

	return (
		<main className={styles.register_page}>
			{registerMutation.isPending ? (
				<div>LOADING</div>
			) : (
				<>
					<section>
						<p>Let's get you started sharing your links!</p>
						<h2>Create account</h2>
					</section>
					<section>
						<form
							className={styles.register_page__form}
							onSubmit={handleSubmit(onRegisterSubmit)}
						>
							<TextField
								{...register("username")}
								error={errors.username}
								iconVariant='user'
								label='username'
								placeholder='alex'
							/>
							<TextField
								{...register("email")}
								error={errors.email}
								iconVariant='mail'
								label='email'
								placeholder='e.g. alex@email.com'
							/>
							<TextField
								{...register("password")}
								error={errors.password}
								iconVariant='lock'
								type='password'
								label='password'
								placeholder='At least 8 characters'
							/>
							<TextField
								{...register("confirm_password")}
								error={errors.confirm_password}
								iconVariant='lock'
								type='password'
								label='confirm password'
								placeholder='At least 8 characters'
							/>
							<Button variant='default'>Create new account</Button>
						</form>
					</section>
					<section>
						<p>Already have an account?</p>
						<Link to='/login'>Login</Link>
					</section>
				</>
			)}
		</main>
	);
};

export default CreateUserAccount;
