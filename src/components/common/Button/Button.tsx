import { ReactNode } from "react";
import styles from "./Button.module.scss";

interface ButtonProps {
	children: ReactNode;
	variant: "default" | "secondary";
	disabled?: boolean;
	type?: "submit" | "button" | "reset" | undefined;
	onClick?: () => void;
}

const Button = ({
	children,
	variant = "default",
	disabled,
	type,
	...props
}: ButtonProps) => {
	return (
		<button
			{...props}
			type={type}
			disabled={disabled}
			className={
				variant === "secondary"
					? styles.button_secondary
					: styles.button_primary
			}
		>
			{children}
		</button>
	);
};

export default Button;
