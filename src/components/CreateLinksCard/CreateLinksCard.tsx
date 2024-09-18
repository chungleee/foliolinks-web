import styles from "./CreateLinksCard.module.scss";
import { FieldErrors, UseFormRegister } from "react-hook-form";
import TextField from "../common/TextField/TextField";
import { TCreateLinksValues } from "../../zod";
import { Project, ProjectErrors } from "../../types";

interface CreateLinksCardProps {
	cardIndex: number;
	remove?: (index?: number | number[]) => void;
	errors?: FieldErrors<ProjectErrors> | undefined;
	register?: UseFormRegister<TCreateLinksValues>;
	existingProject?: Project;
	existingProjectIdx?: number;
	handleDelete?: (project: Project) => void;
}

const CreateLinksCard = ({
	cardIndex,
	remove,
	errors,
	register,
	existingProject: initialProjectData,
	existingProjectIdx,
	handleDelete,
}: CreateLinksCardProps) => {
	return (
		<div
			className={
				initialProjectData
					? `${styles.create_links_card} ${styles.existing_project}`
					: `${styles.create_links_card}`
			}
		>
			<div>
				<span>link #{`${existingProjectIdx || cardIndex + 1}`}</span>
				{handleDelete && initialProjectData ? (
					<button onClick={() => handleDelete?.(initialProjectData)}>
						delete
					</button>
				) : (
					<button onClick={() => remove?.(cardIndex)}>remove</button>
				)}
			</div>
			<TextField
				label='Project name'
				iconVariant='zap'
				placeholder='Enter the name of your project'
				inputContainerClassName={styles.create_links_card__textfields}
				{...(register && register(`projects.${cardIndex}.project_name`))}
				error={errors?.project_name}
				value={initialProjectData?.project_name}
			/>
			<TextField
				label='Link'
				iconVariant='link'
				placeholder='e.g. https//www.github.com/project'
				inputContainerClassName={styles.create_links_card__textfields}
				{...(register && register(`projects.${cardIndex}.project_url`))}
				error={errors?.project_url}
				value={initialProjectData?.project_url}
			/>
		</div>
	);
};

export default CreateLinksCard;
