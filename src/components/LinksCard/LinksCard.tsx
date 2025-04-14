import styles from "./LinksCard.module.scss";
import {
	Control,
	FieldErrors,
	UseFormRegister,
	useWatch,
} from "react-hook-form";
import TextField from "../common/TextField/TextField";
import { TCreateLinksValues } from "../../zod";
import { Project, ProjectErrors } from "../../types";
import { useState } from "react";
import TextArea from "../common/TextArea/TextArea";

interface LinksCardProps {
	cardIndex: number;
	remove?: (index?: number | number[]) => void;
	errors?: FieldErrors<ProjectErrors> | undefined;
	register?: UseFormRegister<TCreateLinksValues>;
	existingProject?: Project;
	handleDelete?: ({
		project,
		fieldIndex,
	}: {
		project: Project;
		fieldIndex: number;
	}) => void;
	handleUpdateProject?: (data: Project) => void;
	control?: Control<TCreateLinksValues>;
}

const LinksCard = ({
	cardIndex,
	remove,
	errors,
	register,
	existingProject: initialProjectData,
	handleDelete,
	handleUpdateProject,
	control,
}: LinksCardProps) => {
	const [isEditing, setIsEditing] = useState<boolean | undefined>(
		initialProjectData ? false : undefined
	);

	const { project_name, project_url, project_description } = useWatch({
		control,
		name: `projects.${cardIndex}`,
	});

	const isDiff =
		initialProjectData?.project_name !== project_name ||
		initialProjectData?.project_url !== project_url ||
		initialProjectData?.project_description !== project_description
			? true
			: false;

	return (
		<div
			className={
				initialProjectData
					? `${styles.create_links_card} ${styles.existing_project}`
					: `${styles.create_links_card}`
			}
		>
			<div>
				<span>link #{`${cardIndex + 1}`}</span>
				{isEditing && initialProjectData ? (
					<div>
						<button
							disabled={!isDiff}
							onClick={() => {
								if (!handleUpdateProject || !initialProjectData) return;
								if (isDiff) {
									handleUpdateProject({
										...initialProjectData,
										project_name,
										project_url,
										project_description,
									});
								}
							}}
						>
							save
						</button>
						<button onClick={() => setIsEditing(!isEditing)}>cancel</button>
					</div>
				) : (
					<div>
						{!!(handleUpdateProject && initialProjectData) && (
							<button onClick={() => setIsEditing(!isEditing)}>
								{isEditing ? "cancel" : "edit"}
							</button>
						)}
						{handleDelete && initialProjectData ? (
							<button
								onClick={() =>
									handleDelete?.({
										project: initialProjectData,
										fieldIndex: cardIndex,
									})
								}
							>
								delete
							</button>
						) : (
							<button
								onClick={() => {
									remove?.(cardIndex);
								}}
							>
								remove
							</button>
						)}
					</div>
				)}
			</div>
			<TextField
				label='Project name'
				iconVariant='zap'
				placeholder='Enter the name of your project'
				inputContainerClassName={styles.create_links_card__textfields}
				{...(register && register(`projects.${cardIndex}.project_name`))}
				error={errors?.project_name}
				editing={initialProjectData ? !isEditing : isEditing}
				defaultValue={`projects.${cardIndex}.project_name`}
			/>
			<TextArea
				label='Description'
				iconVariant='text'
				placeholder='Enter the name of your project'
				inputContainerClassName={styles.create_links_card__textfields}
				{...(register && register(`projects.${cardIndex}.project_description`))}
				error={errors?.project_description}
				editing={initialProjectData ? !isEditing : isEditing}
			/>
			<TextField
				label='Link'
				iconVariant='link'
				placeholder='e.g. https//www.github.com/project'
				inputContainerClassName={styles.create_links_card__textfields}
				{...(register && register(`projects.${cardIndex}.project_url`))}
				error={errors?.project_url}
				editing={initialProjectData ? !isEditing : isEditing}
				defaultValue={`projects.${cardIndex}.project_url`}
			/>
		</div>
	);
};

export default LinksCard;
