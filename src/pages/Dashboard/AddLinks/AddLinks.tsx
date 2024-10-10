import styles from "./AddLinks.module.scss";
import { useForm, useFieldArray } from "react-hook-form";
import { useContext, useEffect, useRef } from "react";
import { flushSync } from "react-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { TCreateLinksValues, createLinkSchema } from "../model";
import Button from "../../../components/common/Button/Button";
import LinksCard from "../../../components/LinksCard/LinksCard";
import DashboardLayout from "../DashboardLayout";
import { Project } from "../../../types";
import { UserContext } from "../../../contexts/UserProvider";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

const AddLinks = () => {
	const { userProfile } = useContext(UserContext);
	const ulRef = useRef<HTMLUListElement | null>(null);
	const queryClient = useQueryClient();

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

	const getProjects = async (): Promise<Project[]> => {
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

		return json.projects;
	};

	const { data: projects } = useQuery({
		queryKey: ["projects"],
		queryFn: getProjects,
	});

	useEffect(() => {
		projects?.forEach((project, index) => {
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

	const handleSave = (data: TCreateLinksValues) => {
		const createProjects = data.projects.filter((project) => {
			return !project.project_id ? project : false;
		});

		if (createProjects.length) {
			createProjectsMutation.mutate(createProjects);
		}
	};

	const createProjects = async (data: TCreateLinksValues["projects"]) => {
		try {
			const url = import.meta.env.DEV
				? import.meta.env.VITE_DEV_API
				: import.meta.env.VITE_PROD_URL;
			const token = localStorage.getItem("foliolinks_access_token");

			const result = await fetch(`${url}/api/users/projects`, {
				method: "POST",
				body: JSON.stringify({ projects: data }),
				headers: {
					Authorization: `Bearer ${token}`,
					"Content-Type": "application/json",
				},
			});

			const json = await result.json();
			return json.projects;
		} catch (error) {
			console.log("error: ", error);
		}
	};

	const createProjectsMutation = useMutation({
		mutationFn: createProjects,
		onSuccess: (data) => {
			queryClient.setQueryData(["projects"], (prevProjects: Project[]) => {
				return [...prevProjects, ...data];
			});
		},
	});

	const deleteProject = async (data: {
		project: Project;
		fieldIndex: number;
	}) => {
		const { project, fieldIndex } = data;
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

			return {
				project: json.project,
				fieldIndex,
			};
		} catch (error) {
			console.log("error: ", error);
		}
	};

	const deleteProjectMutation = useMutation({
		mutationFn: deleteProject,
		onSuccess: (data) => {
			remove(data?.fieldIndex);
			queryClient.setQueryData(["projects"], (prevProjects: Project[]) => {
				return prevProjects.filter((p) => {
					return p.id !== data?.project.id;
				});
			});
		},
	});

	const updateProject = async (
		project: Project
	): Promise<Project[] | undefined> => {
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

			const updatedProjects = projects?.map((project) => {
				if (project.id === json.updatedProject.id) {
					return (project = {
						...json.updatedProject,
					});
				}
				return project;
			});

			return updatedProjects;
		} catch (error) {
			console.log("error: ", error);
		}
	};

	const updateProjectMutation = useMutation({
		mutationFn: updateProject,
		onSuccess: (data) => {
			if (data) {
				queryClient.setQueryData(["projects"], () => {
					return [...data];
				});
			}
		},
	});

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
									const existingProject = projects?.find((project) => {
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
												handleDelete={
													existingProject
														? (data) => deleteProjectMutation.mutateAsync(data)
														: undefined
												}
												handleUpdateProject={
													existingProject
														? (data) => updateProjectMutation.mutateAsync(data)
														: undefined
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
