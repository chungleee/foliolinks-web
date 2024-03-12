import styles from "./CreateLinksCard.module.scss";
import { FieldErrors, UseFormRegister } from "react-hook-form";
import TextField from "../common/TextField/TextField";
import { TCreateLinksValues } from "../../zod";

interface FolioLinkErrors {
	projectName: string;
	projectLink: string;
}

interface CreateLinksCardProps {
	cardIndex: number;
	remove: (index?: number | number[]) => void;
	errors: FieldErrors<FolioLinkErrors> | undefined;
	register: UseFormRegister<TCreateLinksValues>;
}

const CreateLinksCard = ({
	cardIndex,
	remove,
	errors,
	register,
}: CreateLinksCardProps) => {
	return (
		<div className={styles.create_links_card}>
			<div>
				<span>link #{`${cardIndex + 1}`}</span>
				<button onClick={() => remove(cardIndex)}>remove</button>
			</div>
			<TextField
				label='Project name'
				iconVariant='zap'
				placeholder='Enter the name of your project'
				inputContainerClassName={styles.create_links_card__textfields}
				{...register(`foliolinks.${cardIndex}.projectName`)}
				error={errors?.projectName}
			/>
			<TextField
				label='Link'
				iconVariant='link'
				placeholder='e.g. https//www.github.com/project'
				inputContainerClassName={styles.create_links_card__textfields}
				{...register(`foliolinks.${cardIndex}.projectLink`)}
				error={errors?.projectLink}
			/>
		</div>
	);
};

export default CreateLinksCard;