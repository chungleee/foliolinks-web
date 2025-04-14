import { ChangeEvent, forwardRef } from "react";
import styles from "./TextArea.module.scss";
import { FieldError } from "react-hook-form";
import Icon from "../Icon";

interface TextAreaProps {
	label?: string;
	error?: FieldError;
	placeholder?: string;
	iconVariant?: "link" | "mail" | "lock" | "zap" | "user" | "text";
	type?: "text" | "password" | string;
	className?: string;
	inputClassName?: string;
	labelClassName?: string;
	inputContainerClassName?: string;
	defaultValue?: string;
	editing?: boolean;
	disabled?: boolean;
	readonly?: boolean;
	value?: string;
	onChange?: (e: ChangeEvent<HTMLTextAreaElement>) => void;
}

const TextArea = forwardRef<HTMLTextAreaElement, TextAreaProps>(
	(
		{
			error,
			iconVariant,
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
			value,
			onChange,
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
								? `${styles.textarea} ${inputContainerClassName} ${styles.error}`
								: `${styles.textarea} ${inputContainerClassName}`
						}
					>
						{iconVariant ? (
							<Icon variant={iconVariant} className={styles.textarea_icon} />
						) : null}
						<textarea
							className={inputClassName}
							ref={ref}
							{...props}
							placeholder={placeholder}
							defaultValue={defaultValue}
							disabled={editing || disabled}
							readOnly={!!readonly}
							value={value}
							onChange={onChange}
						/>
					</div>
					{error?.message && (
						<small className={styles.error_message}>{error.message}</small>
					)}
				</label>
			</div>
		);
	}
);

export default TextArea;
