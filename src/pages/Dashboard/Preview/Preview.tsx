import { useContext } from "react";

import styles from "./Preview.module.scss";

import DashboardLayout from "../DashboardLayout";
import ProjectLink from "../../../components/common/ProjectLink/ProjectLink";

import { UserContext } from "../../../contexts/UserContext";
import { ProjectsContext } from "../../../contexts/ProjectsContext";

const Preview = () => {
	const { userProfile } = useContext(UserContext);
	const { projects, isProjectsLoading } = useContext(ProjectsContext)!;

	const { firstName, lastName, email } = userProfile || {};

	if (isProjectsLoading) return <h1>Loading...</h1>;

	return (
		<DashboardLayout>
			<div className={styles.preview}>
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
			</div>
		</DashboardLayout>
	);
};

export default Preview;
