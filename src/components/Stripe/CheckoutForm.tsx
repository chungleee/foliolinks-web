import { ErrorOption, useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
	CheckoutContextValue,
	PaymentElement,
	useCheckout,
} from "@stripe/react-stripe-js";

import TextField from "../common/TextField/TextField";
import { handleUpgradeMembership } from "../../api/stripe";
import { useState } from "react";

const schema = z.object({
	email: z
		.string()
		.min(1, { message: "Can't be empty" })
		.email({ message: "Invalid email address" })
		.trim()
		.toLowerCase(),
});

type Schema = z.infer<typeof schema>;

const CheckoutForm = () => {
	const [membershipUpgraded, setMembershipUpgraded] = useState(false);
	const checkout = useCheckout();

	const {
		register,
		handleSubmit,
		formState: { errors, defaultValues },
		setError,
	} = useForm<Schema>({
		resolver: zodResolver(schema),
	});

	const handleValidateEmail = async (
		email: string,
		checkout: CheckoutContextValue
	) => {
		const updateResult = await checkout.updateEmail(email);
		const isValid = updateResult.type !== "error";

		return { isValid, message: !isValid ? updateResult.error.message : null };
	};

	const handleChange = async () => {
		if (!defaultValues?.email) return;

		const { isValid, message } = await handleValidateEmail(
			defaultValues?.email,
			checkout
		);

		if (!isValid) {
			setError("email", message as ErrorOption);
			return;
		}
	};

	const onFormSubmit = async (data: Schema) => {
		const { isValid, message } = await handleValidateEmail(
			data.email,
			checkout
		);

		if (!isValid) {
			setError("email", message as ErrorOption);
			return;
		}

		const confirmResult = await checkout.confirm({
			redirect: "if_required",
			returnUrl: "https://localhost:5173/dashboard/settings",
		});

		if (confirmResult.type === "error") {
			setError("email", confirmResult.error.message as ErrorOption);
		}

		if (confirmResult.type === "success") {
			const confirmUpgrade = await handleUpgradeMembership();

			if (confirmUpgrade.type === "success") {
				setMembershipUpgraded(true);
			}
		}
	};

	if (membershipUpgraded) {
		return (
			<div>
				<h1>Success!</h1>
				<h3>Payment successful and membership has been upgraded</h3>
			</div>
		);
	}

	return (
		<form onSubmit={handleSubmit(onFormSubmit)}>
			<TextField
				{...register("email")}
				label='email'
				placeholder='johndoe@example.com'
				error={errors.email}
				iconVariant='mail'
				onChange={handleChange}
			/>
			<h4>Payment</h4>
			<PaymentElement />
			<button type='submit'>{`Pay ${checkout.total.total.amount} now`}</button>
		</form>
	);
};

export default CheckoutForm;
