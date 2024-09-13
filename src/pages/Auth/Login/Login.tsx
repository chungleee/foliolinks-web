import styles from "./Login.module.scss";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FunctionComponent, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { TLoginFormInputs, loginSchema } from "../model";
import TextField from "../../../components/common/TextField/TextField";
import Button from "../../../components/common/Button/Button";
import AuthLayout from "../AuthLayout";
import { useAuth } from "../../../utils/hooks";

const Login: FunctionComponent = () => {
	useAuth();
	const navigate = useNavigate();
	const [isPending, setIsPending] = useState(false);

	const {
		handleSubmit,
		register,
		formState: { errors },
	} = useForm<TLoginFormInputs>({
		resolver: zodResolver(loginSchema),
	});

	const onLoginSubmit = async (data: TLoginFormInputs) => {
		setIsPending(true);
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

			await localStorage.setItem("foliolinks_access_token", access_token);
			await navigate("/dashboard");
		} catch (error) {
			console.log(error);
			setIsPending(false);
		} finally {
			setIsPending(false);
		}
	};

	return (
		<AuthLayout>
			<main className={styles.login_page}>
				{isPending ? (
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
