import { useContext, useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import styles from "./Profile.module.scss";
import { zodResolver } from "@hookform/resolvers/zod";
import { TProfileFormValues, profileSchema } from "../model";
import TextField from "../../../components/common/TextField/TextField";
import Button from "../../../components/common/Button/Button";
import Icon from "../../../components/common/Icon";
import DashboardLayout from "../DashboardLayout";
import { UserContext } from "../../../contexts/UserContext";

const Profile = () => {
	const { userProfile, isProfileComplete } = useContext(UserContext);
	const { username, firstName, lastName, email } = userProfile ?? {};

	const [previewImg, setPreviewImg] = useState<string>("");
	const labelRef = useRef<HTMLLabelElement>(null);

	const {
		handleSubmit,
		register,
		formState: { errors },
	} = useForm<TProfileFormValues>({
		resolver: zodResolver(profileSchema),
		mode: "onSubmit",
	});

	const handleSave = async (data: TProfileFormValues) => {
		console.log("form data: ", data);
		try {
			const url = import.meta.env.DEV
				? import.meta.env.VITE_DEV_API
				: import.meta.env.VITE_PROD_URL;

			const token = localStorage.getItem("foliolinks_access_token");
			const result = await fetch(`${url}/api/users/profile/create`, {
				method: "POST",
				body: JSON.stringify(data),
				headers: {
					Authorization: `Bearer ${token}`,
					"Content-Type": "application/json",
				},
			});
			const json = await result.json();

			console.log("json: ", json);
		} catch (error) {
			console.error("save error: ", error);
		}
	};

	useEffect(() => {
		if (labelRef.current) {
			labelRef.current.style.backgroundImage = `url(${previewImg})`;
			labelRef.current.style.filter = "grayscale(15%)";
		}
	}, [previewImg]);

	return (
		<DashboardLayout>
			<div className={styles.profile}>
				<section className={styles.profile__intro}>
					<p>Add your details to create a personal touch to your profile.</p>
					<h2>Profile Details</h2>
				</section>

				<form className={styles.profile__form_section}>
					<div className={styles.profile__form_section__image_upload}>
						<p>Profile picture</p>
						<div>
							<label ref={labelRef}>
								<Icon
									className={previewImg ? styles.uploaded_img_text : ""}
									variant='image'
								/>
								{previewImg ? (
									<span className={styles.uploaded_img_text}>Change Image</span>
								) : (
									<span>+ Upload Image</span>
								)}
								<input
									type='file'
									{...register("profilePic", {
										onChange: (event) => {
											const file = event.target.files[0];
											setPreviewImg(URL.createObjectURL(file));
										},
									})}
									accept='image/jpg, image/jpeg, image/webp, image/png'
								/>
							</label>
							<small>
								Image must be below 5MB. Use WebP, PNG or JPG formats.
							</small>
							{errors.profilePic && (
								<small className={styles.error}>
									{errors.profilePic.message?.toString()}
								</small>
							)}
						</div>
					</div>

					<div className={styles.profile__form_section__personal_deets}>
						<TextField
							labelClassName={styles.textfields_layout}
							inputContainerClassName={styles.textfields}
							label='Username *'
							type='text'
							{...register("username")}
							error={errors.firstName}
							placeholder='John'
							disabled={isProfileComplete}
							defaultValue={username}
						/>
						<TextField
							labelClassName={styles.textfields_layout}
							inputContainerClassName={styles.textfields}
							label='First name *'
							type='text'
							{...register("firstName")}
							error={errors.firstName}
							placeholder='John'
							disabled={isProfileComplete}
							defaultValue={firstName}
						/>
						<TextField
							labelClassName={styles.textfields_layout}
							inputContainerClassName={styles.textfields}
							label='Last name *'
							type='text'
							{...register("lastName")}
							error={errors.lastName}
							placeholder='Doe'
							disabled={isProfileComplete}
							defaultValue={lastName}
						/>
						<TextField
							labelClassName={styles.textfields_layout}
							inputContainerClassName={styles.textfields}
							label='Email'
							type='email'
							{...register("email")}
							error={errors.email}
							placeholder='e.g. johndoe@email.com'
							disabled={isProfileComplete}
							defaultValue={email}
						/>
					</div>

					<section className={styles.save_button}>
						<Button
							onClick={handleSubmit(handleSave)}
							variant='default'
							type='submit'
							disabled={isProfileComplete}
						>
							Save
						</Button>
					</section>
				</form>
			</div>
		</DashboardLayout>
	);
};

export default Profile;
