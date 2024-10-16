import styles from "./Login.module.scss";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FunctionComponent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { TLoginFormInputs, loginSchema } from "../model";
import TextField from "../../../components/common/TextField/TextField";
import Button from "../../../components/common/Button/Button";
import AuthLayout from "../AuthLayout";
import { useAuth } from "../../../utils/hooks";
import { useMutation } from "@tanstack/react-query";

const Login: FunctionComponent = () => {
	useAuth();
	const navigate = useNavigate();

	const {
		handleSubmit,
		register,
		formState: { errors },
	} = useForm<TLoginFormInputs>({
		resolver: zodResolver(loginSchema),
	});

	const handleLogin = async (data: TLoginFormInputs) => {
		try {
			const url = import.meta.env.DEV
				? import.meta.env.VITE_DEV_API
				: import.meta.env.VITE_PROD_URL;

			const result = await fetch(`${url}/api/users/auth/login`, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(data),
				credentials: "include",
			});

			const json = await result.json();
			const { access_token } = await json;

			localStorage.setItem("foliolinks_access_token", access_token);
		} catch (error) {
			console.log(error);
		}
	};

	const loginMutation = useMutation({
		mutationFn: handleLogin,
		onSuccess: () => {
			navigate("/dashboard");
		},
		onError: (error) => {
			console.log(error);
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
