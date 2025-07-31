import { useEffect, useMemo, useState } from "react";
import { CheckoutProvider } from "@stripe/react-stripe-js";
import { stripePromise } from "../../config/stripe";

import CheckoutForm from "./CheckoutForm";

import {
	stripeCheckoutSessionPromiseAPI,
	stripeRemoveCheckoutSessionAPI,
} from "../../api/stripe";

const StripeCheckoutForm = () => {
	const [sessionId, setSessionId] = useState("");
	const handleCheckoutSessionPromise = useMemo(async () => {
		const { clientSecret, checkoutSessionId } =
			await stripeCheckoutSessionPromiseAPI();

		setSessionId(checkoutSessionId);
		return clientSecret;
	}, []);

	useEffect(() => {
		return () => {
			if (sessionId) {
				stripeRemoveCheckoutSessionAPI(sessionId);
			}
		};
	}, [sessionId]);

	return (
		<div>
			<h1>stripe checkout form</h1>
			<div>
				<CheckoutProvider
					stripe={stripePromise}
					options={{
						fetchClientSecret: () => handleCheckoutSessionPromise,
					}}
				>
					<CheckoutForm />
				</CheckoutProvider>
			</div>
		</div>
	);
};

export default StripeCheckoutForm;
