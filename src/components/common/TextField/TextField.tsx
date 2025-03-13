import { forwardRef } from "react";
import styles from "./TextField.module.scss";
import { FieldError } from "react-hook-form";
import Icon from "../Icon";

interface TextFieldProps {
	label?: string;
	error?: FieldError;
	placeholder?: string;
	iconVariant?: "link" | "mail" | "lock" | "zap";
	type?: "text" | string;
	className?: string;
	inputClassName?: string;
	labelClassName?: string;
	inputContainerClassName?: string;
	defaultValue?: string;
	editing?: boolean;
	disabled?: boolean;
	readonly?: boolean;
}

const TextField = forwardRef<HTMLInputElement, TextFieldProps>(
	(
		{
			error,
			iconVariant,
			type,
			placeholder,
			label,
			className,
			inputClassName,
			labelClassName,
			inputContainerClassName,
			defaultValue,
			editing,
			disabled,
			readonly,
			...props
		},
		ref
	) => {
		return (
			<div className={className}>
				<label className={`${styles.label} ${labelClassName}`}>
					{label}
					<div
						className={
							error
								? `${styles.textfield} ${inputContainerClassName} ${styles.error}`
								: `${styles.textfield} ${inputContainerClassName}`
						}
					>
						{iconVariant ? (
							<Icon variant={iconVariant} className={styles.textfield_icon} />
						) : null}
						<input
							className={inputClassName}
							ref={ref}
							{...props}
							type={type}
							placeholder={placeholder}
							defaultValue={defaultValue}
							disabled={editing || disabled}
							readOnly={!!readonly}
						/>
						{error?.message && (
							<small className={styles.error_message}>{error.message}</small>
						)}
					</div>
				</label>
			</div>
		);
	}
);

export default TextField;
