import * as z from "zod";

// ***** LINK FORM SCHEMA/TYPES *****
export const createLinkSchema = z.object({
	projects: z
		.object({
			project_name: z
				.string()
				.min(1, { message: "Project name is required" })
				.trim(),
			project_description: z.string().max(1000).trim().optional(),
			project_url: z
				.string()
				.url()
				.min(1, { message: "URL is required" })
				.trim(),
		})
		.array(),
});

export type TCreateLinksValues = z.infer<typeof createLinkSchema>;

// ***** PROFILE FORM SCHEMA / TYPES *****
const ACCEPTED_FORMATS = ["image/jpg", "image/jpeg", "image/webp", "image/png"];

const MAX_FILE_SIZE = 5000000;

export const profileSchema = z.object({
	profilePic: z
		.any()
		.refine((files: FileList) => {
			return files.length;
		}, "Please upload an image")
		.refine((files: FileList) => {
			return ACCEPTED_FORMATS.includes(files[0]?.type);
		}, "This format is not accepted")
		.refine((files: FileList) => {
			return files[0]?.size <= MAX_FILE_SIZE;
		}, "File needs to be 5MB or less"),
	firstName: z.string().min(1, { message: "Field is required" }).trim(),
	lastName: z.string().min(1, { message: "Field is required" }).trim(),
	email: z
		.string()
		.transform((value) => {
			if (!value) return;
			return value;
		})
		.pipe(
			z
				.string()
				.email({ message: "Invalie email address" })
				.trim()
				.toLowerCase()
				.optional()
		),
});

export type TProfileFormValues = z.infer<typeof profileSchema>;

// API key form
export const apikeyFormSchema = z.object({
	domain: z
		.string()
		.min(1, { message: "Field is required" })
		.url()
		.trim()
		.toLowerCase(),
	apikey: z.string().optional().readonly(),
	apikeyId: z.string().optional().readonly(),
});

export type TApikeyFormValues = z.infer<typeof apikeyFormSchema>;
