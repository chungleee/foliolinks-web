import { useContext } from "react";
import { Link } from "react-router-dom";

import styles from "./Preview.module.scss";

import ProjectLink from "../../../components/common/ProjectLink/ProjectLink";

import { UserContext } from "../../../contexts/UserContext";
import { ProjectsContext } from "../../../contexts/ProjectsContext";
import { Button } from "../../../components/common/Button/Button";

const Preview = () => {
	const { userProfile } = useContext(UserContext);
	const { projects, isProjectsLoading } = useContext(ProjectsContext)!;

	const { firstName, lastName, email } = userProfile || {};

	const handleCopyToClipboard = async () => {
		await navigator.clipboard.writeText("testcopytoclipboard.com");
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
						<img alt='avatar' />
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
		</div>
	);
};

export default Preview;
