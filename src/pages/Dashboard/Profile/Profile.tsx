import { useContext, useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import Cropper, { Area, Point } from "react-easy-crop";

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
	const [previewImg, setPreviewImg] = useState<string>("");
	const [croppedImage, setCroppedImage] = useState<string | null>(null);
	const [error, setError] = useState("");
	const [crop, setCrop] = useState<Point>({ x: 0, y: 0 });
	const [zoom, setZoom] = useState(1);

	const labelRef = useRef<HTMLLabelElement>(null);

	const { userProfile, isProfileComplete } = useContext(UserContext);

	const queryClient = useQueryClient();

	const { username, firstName, lastName, email, avatar } = userProfile ?? {};

	const {
		handleSubmit,
		register,
		formState: { errors },
		setValue,
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
				avatar: data?.avatar,
			});
		},
		onError: (error) => setError(error.message),
	});

	const handleSubmitUserProfile = async (data: TUserInfoInputs) => {
		const formData = new FormData();

		if (croppedImage) {
			try {
				const response = await fetch(croppedImage);
				const blob = await response.blob();

				const croppedImageFile = new File([blob], `${username}-avatar.jpg`, {
					type: "image/jpeg",
				});

				formData.append("profilePic", croppedImageFile);
				setPreviewImg("");
			} catch (error) {
				console.log("submission cropped image error: ", error);
			}
		} else {
			formData.append("profilePic", data.profilePic[0]);
		}
		formData.append("firstName", data.firstName);
		formData.append("lastName", data.lastName);
		createUserProfileMutation.mutate(formData);
	};

	const handleCropComplete = async (
		_croppedArea: Area,
		croppedAreaPixels: Area
	) => {
		try {
			const croppedImageUrl = await handleGetCroppedImg(
				previewImg,
				croppedAreaPixels
			);
			setCroppedImage(croppedImageUrl as string);
		} catch (error) {
			console.log("image cropping error: ", error);
		}
	};

	const handleGetCroppedImg = (imageSrc: string, croppedAreaPixels: Area) => {
		return new Promise((resolve, reject) => {
			const image = new Image();
			image.src = imageSrc;

			image.onload = () => {
				const canvas = document.createElement("canvas");
				const ctx = canvas.getContext("2d");

				const { width, height } = croppedAreaPixels;

				canvas.width = width;
				canvas.height = height;

				ctx?.drawImage(
					image,
					croppedAreaPixels.x,
					croppedAreaPixels.y,
					width,
					height,
					0,
					0,
					width,
					height
				);

				canvas.toBlob((blob) => {
					if (!blob) {
						reject(new Error("Canvas is empty"));
						return;
					}
					const fileUrl = URL.createObjectURL(blob);
					resolve(fileUrl);
				}, "image/jpeg");
			};

			image.onerror = (error) => {
				reject(error);
			};
		});
	};

	useEffect(() => {
		if (isProfileComplete && username && firstName && lastName && email) {
			setValue("username", username);
			setValue("firstName", firstName);
			setValue("lastName", lastName);
			setValue("email", email);
		}
		if (labelRef.current) {
			if (avatar) {
				labelRef.current.style.backgroundImage = `url(${avatar})`;
			}
			if (previewImg) {
				labelRef.current.style.backgroundImage = `url(${previewImg})`;
				labelRef.current.style.filter = "grayscale(15%)";
			}
		}
	}, [
		isProfileComplete,
		username,
		firstName,
		lastName,
		email,
		setValue,
		avatar,
		previewImg,
	]);

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
							{!previewImg && (
								<label ref={labelRef}>
									<Icon
										className={previewImg ? styles.uploaded_img_text : ""}
										variant='image'
									/>
									{previewImg ? (
										<span className={styles.uploaded_img_text}>
											Change Image
										</span>
									) : (
										<span>+ Upload Image</span>
									)}
									<input
										type='file'
										{...register("profilePic", {
											onChange: (event) => {
												const file = event.target.files[0];
												const objUrl = URL.createObjectURL(file);

												setPreviewImg(objUrl);
											},
										})}
										accept='image/jpg, image/jpeg, image/webp, image/png'
									/>
								</label>
							)}
							{previewImg && (
								<div>
									<div
										style={{
											position: "relative",
											height: "250px",
											width: "250px",
										}}
									>
										<Cropper
											image={previewImg}
											crop={crop}
											onCropChange={setCrop}
											cropShape='round'
											aspect={1}
											zoom={zoom}
											onCropComplete={handleCropComplete}
											objectFit='contain'
										/>
									</div>
									<div>
										<input
											type='range'
											value={zoom}
											min={1}
											max={3}
											step={0.1}
											aria-labelledby='Zoom'
											onChange={(e) => {
												setZoom(Number(e.target.value));
											}}
											className='zoom-range'
										/>
									</div>
								</div>
							)}
							<small>
								Image must be below 2MB. Use WebP, PNG or JPG formats.
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
							// disabled={isProfileComplete}
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
