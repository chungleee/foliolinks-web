import * as z from "zod";

export const loginSchema = z.object({
	email: z
		.string()
		.min(1, { message: "Can't be empty" })
		.email({ message: "Invalid email address" })
		.trim()
		.toLowerCase(),
	password: z.string().min(1, { message: "Please check again" }),
});

export type TLoginFormInputs = z.infer<typeof loginSchema>;

export const registerSchema = z
	.object({
		email: z
			.string()
			.min(1, { message: "Can't be empty" })
			.email({ message: "Invalid email address" })
			.trim()
			.toLowerCase(),
		password: z.string().min(8, { message: "Please check again" }).max(64),
		confirm_password: z.string(),
	})
	.refine(
		(data) => {
			return data.password === data.confirm_password;
		},
		{
			message: "Passwords don't match",
			path: ["confirm_password"],
		}
	);

export type TRegisterFormInputs = z.infer<typeof registerSchema>;
