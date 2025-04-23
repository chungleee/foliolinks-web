import { useContext, useState } from "react";
import { Link } from "react-router-dom";

import styles from "./Preview.module.scss";

import ProjectLink from "../../../components/common/ProjectLink/ProjectLink";

import { UserContext } from "../../../contexts/UserContext";
import { ProjectsContext } from "../../../contexts/ProjectsContext";
import { Button } from "../../../components/common/Button/Button";
import Snackbar from "../../../components/common/Snackbar/Snackbar";

const Preview = () => {
	const [showSnackbar, setShowSnackbar] = useState(false);
	const { userProfile } = useContext(UserContext);
	const { projects, isProjectsLoading } = useContext(ProjectsContext)!;

	const { firstName, lastName, email, avatar } = userProfile || {};

	const handleCopyToClipboard = async () => {
		await navigator.clipboard.writeText("testcopytoclipboard.com");
		setShowSnackbar(true);

		setTimeout(() => setShowSnackbar(false), 3000);
	};

	const handleOnClose = () => {
		setShowSnackbar(false);
	};

	if (isProjectsLoading) return <h1>Loading...</h1>;

	return (
		<div className={styles.preview}>
			<div className={styles.preview_nav_container}>
				<nav className={styles.preview_nav}>
					<Button variant='secondary'>
						<Link to='/'>Return to Dashboard</Link>
					</Button>
					<Button onClick={handleCopyToClipboard}>Share Link</Button>
				</nav>
			</div>

			<main>
				<section className={styles.user_bio}>
					<div className={styles.user_bio_avatar}>
						<img alt='avatar' src={avatar ? avatar : undefined} />
					</div>
					<div className={styles.user_bio_description}>
						<h4>{`${email}`}</h4>
						<h1>{`${firstName} ${lastName}`}</h1>
					</div>
				</section>

				<section className={styles.user_projects}>
					<ul>
						{projects?.map((project) => {
							return <ProjectLink key={project.id} project={project} />;
						})}
					</ul>
				</section>
			</main>
			{showSnackbar && (
				<Snackbar
					message='Successfully copied!'
					handleOnClose={handleOnClose}
				/>
			)}
		</div>
	);
};

export default Preview;
