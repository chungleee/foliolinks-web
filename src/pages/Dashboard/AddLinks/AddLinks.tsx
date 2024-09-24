import styles from "./AddLinks.module.scss";
import { useForm, useFieldArray } from "react-hook-form";
import { useContext, useEffect, useRef, useState } from "react";
import { flushSync } from "react-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { TCreateLinksValues, createLinkSchema } from "../model";
import Button from "../../../components/common/Button/Button";
import CreateLinksCard from "../../../components/CreateLinksCard/CreateLinksCard";
import DashboardLayout from "../DashboardLayout";
import { Project } from "../../../types";
import { UserContext } from "../../../contexts/UserProvider";

const AddLinks = () => {
	const { userProfile } = useContext(UserContext);
	const [projects, setProjects] = useState<Project[]>([]);
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

	useEffect(() => {
		const getProjects = async () => {
			const url = import.meta.env.DEV
				? import.meta.env.VITE_DEV_API
				: import.meta.env.VITE_PROD_URL;

			const token = localStorage.getItem("foliolinks_access_token");
			const results = await fetch(`${url}/api/users/projects`, {
				method: "get",
				headers: {
					Authorization: `Bearer ${token}`,
				},
			});

			const json = await results.json();
			setProjects(json.projects);
		};

		getProjects();
	}, [append]);

	const handleAddNewLink = () => {
		flushSync(() => {
			append({ project_name: "", project_url: "" });
		});

		ulRef.current?.lastElementChild?.scrollIntoView({ behavior: "smooth" });
	};

	const handleSave = async (data: TCreateLinksValues) => {
		console.log("data: ", data);
		try {
			const url = import.meta.env.DEV
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

	const handleDelete = async (project: Project) => {
		try {
			const url = import.meta.env.DEV
				? import.meta.env.VITE_DEV_API
				: import.meta.env.VITE_PROD_URL;
			const token = localStorage.getItem("foliolinks_access_token");

			const result = await fetch(`${url}/api/users/projects/${project.id}`, {
				method: "DELETE",
				body: JSON.stringify({
					project,
				}),
				headers: {
					Authorization: `Bearer ${token}`,
					"Content-Type": "application/json",
				},
			});
			const json = await result.json();

			if (json.deleted) {
				const updated = projects.filter((p) => {
					return p.id !== json.project.id;
				});
				setProjects(updated);
			}
		} catch (error) {
			console.log("error: ", error);
		}
	};

	return (
		<DashboardLayout>
			<div className={styles.dashboard}>
				<section>
					<p>
						Add/edit/remove links below and then share all your links with the
						world!
					</p>
					<h2>Customize your links, {`${userProfile?.username}`}</h2>
					<Button onClick={handleAddNewLink} variant='secondary'>
						+ Add new link
					</Button>
				</section>

				<section className={styles.dashboard_create__container}>
					<ul ref={ulRef}>
						{projects.map((project, idx) => {
							return (
								<li key={`${project.id}`}>
									<CreateLinksCard
										existingProject={project}
										cardIndex={idx}
										handleDelete={handleDelete}
									/>
								</li>
							);
						})}
						{fields.length || projects.length ? (
							<>
								{fields.map((field, index) => {
									return (
										<li key={field.id}>
											<CreateLinksCard
												cardIndex={index}
												errors={errors.projects?.[index]}
												existingProjectIdx={projects.length + index + 1}
												register={register}
												remove={remove}
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
