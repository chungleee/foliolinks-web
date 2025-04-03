import styles from "./Login.module.scss";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FunctionComponent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { TLoginFormInputs, loginSchema } from "../model";
import TextField from "../../../components/common/TextField/TextField";
import { Button } from "../../../components/common/Button/Button";
import AuthLayout from "../AuthLayout";
import { useMutation } from "@tanstack/react-query";
import { handleLoginAPI } from "../../../api/auth";

const Login: FunctionComponent = () => {
	const navigate = useNavigate();

	const {
		handleSubmit,
		register,
		formState: { errors },
		setError,
	} = useForm<TLoginFormInputs>({
		resolver: zodResolver(loginSchema),
	});

	const loginMutation = useMutation({
		mutationFn: handleLoginAPI,
		onSuccess: () => {
			navigate("/dashboard");
		},
		onError: (error: { error: string; errorCode: string }) => {
			switch (error.errorCode) {
				case "AuthApiError":
					setError("email", { message: error.error });
			}
		},
	});

	const onLoginSubmit = (data: TLoginFormInputs) => {
		loginMutation.mutate(data);
	};

	return (
		<AuthLayout>
			<main className={styles.login_page}>
				{loginMutation.isPending ? (
					<div>LOADING</div>
				) : (
					<>
						<section>
							<p>Add your details below to get back into the app</p>
							<h2>Login</h2>
						</section>
						<section>
							<form onSubmit={handleSubmit(onLoginSubmit)}>
								<TextField
									label='email'
									iconVariant='mail'
									placeholder='e.g. alex@email.com'
									{...register("email")}
									error={errors.email}
								/>
								<TextField
									placeholder='Enter your password'
									label='password'
									type='password'
									iconVariant='lock'
									{...register("password")}
									error={errors.password}
								/>
								<Button variant='default'>Login</Button>
							</form>
						</section>
						<section>
							<p>Don't have an account?</p>
							<Link to='/register'>Create account</Link>
						</section>
					</>
				)}
			</main>
		</AuthLayout>
	);
};

export default Login;
