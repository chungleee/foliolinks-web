import styles from "./AddLinks.module.scss";
import { useForm, useFieldArray } from "react-hook-form";
import { useEffect, useRef, useState } from "react";
import { flushSync } from "react-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { TCreateLinksValues, createLinkSchema } from "../model";
import Button from "../../../components/common/Button/Button";
import CreateLinksCard from "../../../components/CreateLinksCard/CreateLinksCard";
import DashboardLayout from "../DashboardLayout";

const AddLinks = () => {
	const [projects, setProjects] = useState([]);

	useEffect(() => {
		let url = import.meta.env.DEV
			? import.meta.env.VITE_DEV_API
			: import.meta.env.VITE_PROD_URL;

		const getProjects = async () => {
			const token = localStorage.getItem("foliolinks_access_token");
			const results = await fetch(`${url}/api/users/projects`, {
				method: "get",
				headers: {
					Authorization: `Bearer ${token}`,
				},
			});
			const json = await results.json();
			const { projects } = json;

			if (projects.length) {
				setProjects(projects);
			}
		};

		getProjects();
	}, []);

	const ulRef = useRef<HTMLUListElement | null>(null);

	const {
		control,
		handleSubmit,
		register,
		formState: { errors },
	} = useForm<TCreateLinksValues>({
		resolver: zodResolver(createLinkSchema),
	});

	const { fields, append, remove } = useFieldArray({
		name: "projects",
		control,
	});

	const handleAddNewLink = () => {
		flushSync(() => {
			append({ project_name: "", project_url: "" });
		});

		ulRef.current?.lastElementChild?.scrollIntoView({ behavior: "smooth" });
	};

	const handleSave = async (data: TCreateLinksValues) => {
		console.log("data: ", data);
		try {
			let url = import.meta.env.DEV
				? import.meta.env.VITE_DEV_API
				: import.meta.env.VITE_PROD_URL;
			const token = localStorage.getItem("foliolinks_access_token");

			const result = await fetch(`${url}/api/users/projects`, {
				method: "POST",
				body: JSON.stringify(data),
				headers: {
					Authorization: `Bearer ${token}`,
					"Content-Type": "application/json",
				},
			});
			const json = await result.json();
			console.log("add links json: ", json);
		} catch (error) {
			console.log("error: ", error);
		}
	};

	// const renderProjectsLinksCard = () => {
	// 	return (
	// 		<ul>
	// 			{projects.map((id) => {
	// 				return (
	// 					<li key={id}>
	// 						<CreateLinksCard
	// 							cardIndex={1}
	// 							remove={remove}
	// 							errors={errors.projects?.[1]}
	// 							register={register}
	// 						/>
	// 					</li>
	// 				);
	// 			})}
	// 		</ul>
	// 	);
	// };

	return (
		<DashboardLayout>
			<div className={styles.dashboard}>
				<section>
					<p>
						Add/edit/remove links below and then share all your links with the
						world!
					</p>
					<h2>Customize your links</h2>
					<Button onClick={handleAddNewLink} variant='secondary'>
						+ Add new link
					</Button>
				</section>

				<section className={styles.dashboard_create__container}>
					{/*projects.length ? renderProjectsLinksCard() : null*/}
					<ul ref={ulRef}>
						{fields.length ? (
							<>
								{fields.map((field, index) => {
									return (
										<li key={field.id}>
											<CreateLinksCard
												cardIndex={index}
												remove={remove}
												errors={errors.projects?.[index]}
												register={register}
											/>
										</li>
									);
								})}
							</>
						) : (
							<AddLinkInfo />
						)}
					</ul>
				</section>

				<section>
					<Button
						onClick={handleSubmit(handleSave)}
						type='submit'
						disabled={fields.length ? false : true}
						variant='default'
					>
						Save
					</Button>
				</section>
			</div>
		</DashboardLayout>
	);
};

const AddLinkInfo = () => {
	return (
		<div className={styles.dashboard_create__container_add__link}>
			<div>
				<img
					src='/images/illustration-empty.svg'
					alt='Illustration of a mobile device'
					className={styles.dashboard_create__container_add__link__image}
				/>
			</div>
			<div>
				<p>
					Use the "Add new link" button to get started. Once you have more than
					one link, you can reorder and edit them. We're here to help you share
					your profiles with everyone!
				</p>
				<h2>Let's get you started</h2>
			</div>
		</div>
	);
};

export default AddLinks;
