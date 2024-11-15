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
import { UserContext } from "../../../contexts/UserContext";
import { ProjectsContext } from "../../../contexts/ProjectsContext";
import { useNavigate } from "react-router-dom";

const AddLinks = () => {
	const { userProfile, isProfileComplete } = useContext(UserContext);
	const { projects, createProjects, updateProject, deleteProject } =
		useContext(ProjectsContext)!;
	const ulRef = useRef<HTMLUListElement | null>(null);
	const dialogRef = useRef<HTMLDialogElement | null>(null);
	const navigate = useNavigate();

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
		if (!isProfileComplete) {
			dialogRef.current?.showModal();
		}
	}, [isProfileComplete]);

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
		const createProjectsArray = data.projects.filter((project) => {
			return !project.project_id ? project : false;
		});

		if (createProjectsArray.length) {
			createProjects(createProjectsArray);
		}
	};

	const handleDeleteProject = (data: {
		project: Project;
		fieldIndex: number;
	}) => {
		remove(data.fieldIndex);
		deleteProject(data.project);
	};

	const handleCloseDialog = () => {
		dialogRef.current?.close();
	};

	return (
		<DashboardLayout>
			<div className={styles.dashboard}>
				{isProfileComplete === false && (
					<dialog ref={dialogRef}>
						<h1>Please complete your profile</h1>
						<Button
							variant='default'
							onClick={() => navigate("/dashboard/profile")}
						>
							Profile
						</Button>
						<Button variant='secondary' onClick={handleCloseDialog}>
							Skip
						</Button>
					</dialog>
				)}
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
													existingProject ? handleDeleteProject : undefined
												}
												handleUpdateProject={
													existingProject
														? (data) => updateProject(data)
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
