import styles from "./AddLinks.module.scss";
import { useForm, useFieldArray } from "react-hook-form";
import { useContext, useEffect, useRef, useState } from "react";
import { flushSync } from "react-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { TCreateLinksValues, createLinkSchema } from "../model";
import Button from "../../../components/common/Button/Button";
import LinksCard from "../../../components/LinksCard/LinksCard";
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

	const { fields, append, remove, update } = useFieldArray({
		name: "projects",
		control,
	});

	const limit = userProfile?.membership === "PRO" ? 3 : 1;
	const limitReached = limit <= fields.length;

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
	}, []);

	useEffect(() => {
		projects.forEach((project, index) => {
			update(index, { ...project, project_id: project.id });
		});
	}, [projects, update]);

	const handleAddNewLink = () => {
		if (limitReached) {
			console.log("limit reached");
			return;
		}

		flushSync(() => {
			append({ project_name: "", project_url: "" });
		});

		ulRef.current?.lastElementChild?.scrollIntoView({ behavior: "smooth" });
	};

	const handleSave = async (data: TCreateLinksValues) => {
		const createProjects = data.projects.filter((project) => {
			return !project.project_id ? project : false;
		});

		try {
			const url = import.meta.env.DEV
				? import.meta.env.VITE_DEV_API
				: import.meta.env.VITE_PROD_URL;
			const token = localStorage.getItem("foliolinks_access_token");

			const result = await fetch(`${url}/api/users/projects`, {
				method: "POST",
				body: JSON.stringify({ projects: createProjects }),
				headers: {
					Authorization: `Bearer ${token}`,
					"Content-Type": "application/json",
				},
			});
			const json = await result.json();
			if (json.projects.length) {
				setProjects((prev) => [...prev, ...json.projects]);
			}
			remove();
		} catch (error) {
			console.log("error: ", error);
		}
	};

	const handleDelete = async (project: Project, fieldIndex: number) => {
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
				remove(fieldIndex);
			}
		} catch (error) {
			console.log("error: ", error);
		}
	};

	const handleUpdateProject = async (project: Project) => {
		try {
			const url = import.meta.env.DEV
				? import.meta.env.VITE_DEV_API
				: import.meta.env.VITE_PROD_URL;
			const token = localStorage.getItem("foliolinks_access_token");

			const result = await fetch(`${url}/api/users/projects/`, {
				method: "PATCH",
				body: JSON.stringify({
					updateProject: project,
				}),
				headers: {
					Authorization: `Bearer ${token}`,
					"Content-Type": "application/json",
				},
			});
			const json = await result.json();

			const updatedProjects = projects.map((project) => {
				if (project.id === json.updatedProject.id) {
					return (project = {
						...json.updatedProject,
					});
				}
				return project;
			});
			setProjects(updatedProjects);
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
					<Button
						disabled={limitReached}
						onClick={handleAddNewLink}
						variant='secondary'
					>
						+ Add new link
					</Button>
					{limitReached && <small>You've reached your limits.</small>}
				</section>

				<section className={styles.dashboard_create__container}>
					<ul ref={ulRef}>
						{fields.length ? (
							<>
								{fields.map((field, index) => {
									const existingProject = projects.find((project) => {
										return project.id === field.project_id;
									});
									return (
										<li key={field.id}>
											<LinksCard
												cardIndex={index}
												errors={errors.projects?.[index]}
												existingProject={existingProject}
												register={register}
												remove={!existingProject ? remove : undefined}
												handleDelete={existingProject && handleDelete}
												handleUpdateProject={
													existingProject && handleUpdateProject
												}
												control={control}
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
						disabled={!!fields[fields.length - 1]?.project_id}
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
					Use the "Add new link" button to get started. We're here to help you
					share your profiles with everyone!
				</p>
				<h2>Let's get you started</h2>
			</div>
		</div>
	);
};

export default AddLinks;
