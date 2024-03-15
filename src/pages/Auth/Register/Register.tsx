import styles from "./Register.module.scss";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link } from "react-router-dom";
import { TRegisterFormInputs, registerSchema } from "../model";
import TextField from "../../../components/common/TextField/TextField";
import Button from "../../../components/common/Button/Button";
import AuthLayout from "../AuthLayout";

const Register = () => {
	const {
		handleSubmit,
		register,
		formState: { errors },
	} = useForm<TRegisterFormInputs>({
		resolver: zodResolver(registerSchema),
	});

	const onFormSubmit = (data: TRegisterFormInputs) => {
		console.log("data: ", data);
	};

	return (
		<AuthLayout>
			<main className={styles.register_page}>
				<section>
					<p>Let's get you started sharing your links!</p>
					<h2>Create account</h2>
				</section>
				<section>
					<form
						className={styles.register_page__form}
						onSubmit={handleSubmit(onFormSubmit)}
					>
						<TextField
							{...register("email")}
							// name='email'
							error={errors.email}
							iconVariant='mail'
							label='email'
							placeholder='e.g. alex@email.com'
						/>
						<TextField
							{...register("password")}
							// name='password'
							error={errors.password}
							iconVariant='lock'
							type='password'
							label='password'
							placeholder='At least 8 characters'
							className={styles.form_textfield}
						/>
						<TextField
							{...register("confirm_password")}
							// name='confirm_password'
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
			</main>
		</AuthLayout>
	);
};

export default Register;
