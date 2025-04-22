import * as z from "zod";
import { ACCEPTED_FORMATS, MAX_FILE_SIZE } from "../../Dashboard/model";

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
		username: z
			.string()
			.min(1, { message: "Can't be empty" })
			.toLowerCase()
			.trim(),
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

export const userInfoSchema = z.object({
	firstName: z.string().min(1, { message: "Can't be empty" }).trim(),
	lastName: z.string().min(1, { message: "Can't be empty" }).trim(),
	profilePic: z
		.any()
		.optional()
		.refine((files: FileList | undefined) => {
			if (!files?.length) return true;
			return files.length;
		}, "Please upload an image")
		.refine((files: FileList) => {
			if (!files?.length) return true;
			return ACCEPTED_FORMATS.includes(files[0]?.type);
		}, "This format is not accepted")
		.refine((files: FileList) => {
			if (!files?.length) return true;
			return files[0]?.size <= MAX_FILE_SIZE;
		}, "File needs to be 5MB or less"),
});

export type TUserInfoInputs = z.infer<typeof userInfoSchema>;
