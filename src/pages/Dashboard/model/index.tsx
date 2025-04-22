import * as z from "zod";

// ***** LINK FORM SCHEMA/TYPES *****
export const createLinkSchema = z.object({
	projects: z
		.object({
			project_id: z.string().optional(),
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
export const ACCEPTED_FORMATS = [
	"image/jpg",
	"image/jpeg",
	"image/webp",
	"image/png",
	"image/gif",
];

export const MAX_FILE_SIZE = 5000000;

export const profileSchema = z.object({
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
	username: z.string().trim().min(1, { message: "Field is required" }),
	firstName: z.string().trim().min(1, { message: "Field is required" }),
	lastName: z.string().trim().min(1, { message: "Field is required" }),
	email: z
		.string()
		.optional()
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
