import { ReactNode } from "react";
import styles from "./Button.module.scss";
import Icon from "../Icon";

interface ButtonProps {
	children: ReactNode;
	variant?: "default" | "secondary";
	disabled?: boolean;
	type?: "submit" | "button" | "reset" | undefined;
	onClick?: () => void;
	url?: string;
}

export const Button = ({
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

export const ProjectButton = ({ children, url }: ButtonProps) => {
	return (
		<a
			href={url}
			target='_blank'
			rel='noopener noreferrer'
			className={styles.project_button}
		>
			<span>{children}</span>
			<Icon variant='right-arrow' />
		</a>
	);
};
