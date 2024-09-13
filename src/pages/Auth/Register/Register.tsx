import styles from "./Register.module.scss";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigate } from "react-router-dom";
import { TRegisterFormInputs, registerSchema } from "../model";
import TextField from "../../../components/common/TextField/TextField";
import Button from "../../../components/common/Button/Button";
import AuthLayout from "../AuthLayout";
import { useState } from "react";
import { useAuth } from "../../../utils/hooks";

const Register = () => {
	useAuth();
	const [isPending, setIsPending] = useState(false);
	const navigate = useNavigate();
	const {
		handleSubmit,
		register,
		formState: { errors },
	} = useForm<TRegisterFormInputs>({
		resolver: zodResolver(registerSchema),
	});

	const onRegisterSubmit = async (data: TRegisterFormInputs) => {
		setIsPending(true);
		try {
			const url = import.meta.env.DEV
				? import.meta.env.VITE_DEV_API
				: import.meta.env.VITE_PROD_URL;

			const result = await fetch(`${url}/api/users/auth/register`, {
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
			<main className={styles.register_page}>
				{isPending ? (
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
									className={styles.form_textfield}
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
		</AuthLayout>
	);
};

export default Register;
