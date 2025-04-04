import { useContext, useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import styles from "./Profile.module.scss";

import { zodResolver } from "@hookform/resolvers/zod";
import { TUserInfoInputs } from "../../Auth/model";
import { TProfileFormValues, profileSchema } from "../model";

import { UserContext } from "../../../contexts/UserContext";
import DashboardLayout from "../DashboardLayout";

import TextField from "../../../components/common/TextField/TextField";
import { Button } from "../../../components/common/Button/Button";
import Icon from "../../../components/common/Icon";

import { createUserProfileAPI } from "../../../api/user";

const Profile = () => {
	const queryClient = useQueryClient();
	const [error, setError] = useState("");
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

	const createUserProfileMutation = useMutation({
		mutationFn: createUserProfileAPI,
		onSuccess: (data) => {
			queryClient.setQueryData(["userProfile"], {
				username: data?.username,
				firstName: data?.firstName,
				lastName: data?.lastName,
			});
		},
		onError: (error) => setError(error.message),
	});

	const handleSubmitUserProfile = (data: TUserInfoInputs) => {
		createUserProfileMutation.mutate(data);
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

				<form
					className={styles.profile__form_section}
					onSubmit={handleSubmit(handleSubmitUserProfile)}
				>
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
							placeholder='John'
							disabled={isProfileComplete || !!username}
							defaultValue={username}
						/>
						<TextField
							labelClassName={styles.textfields_layout}
							inputContainerClassName={styles.textfields}
							label='First name *'
							type='text'
							{...(!isProfileComplete && register("firstName"))}
							error={errors.firstName}
							placeholder='John'
							disabled={isProfileComplete || !!firstName}
							defaultValue={firstName}
						/>
						<TextField
							labelClassName={styles.textfields_layout}
							inputContainerClassName={styles.textfields}
							label='Last name *'
							type='text'
							{...(!isProfileComplete && register("lastName"))}
							// {...register("lastName")}
							error={errors.lastName}
							placeholder='Doe'
							disabled={isProfileComplete || !!lastName}
							defaultValue={lastName}
						/>
						<TextField
							labelClassName={styles.textfields_layout}
							inputContainerClassName={styles.textfields}
							label='Email'
							type='email'
							placeholder='e.g. johndoe@email.com'
							disabled={isProfileComplete || !!email}
							defaultValue={email}
						/>
						{error ? <small style={{ color: "red" }}>{error}</small> : null}
					</div>

					<section className={styles.save_button}>
						<Button
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
