import React, { useContext } from "react";
import { UserContext } from "../../../contexts/UserContext";
import { ProjectsContext } from "../../../contexts/ProjectsContext";
import ProjectLink from "../../../components/common/ProjectLink/ProjectLink";

const Preview = () => {
	const { userProfile, isProfileComplete } = useContext(UserContext);
	const { projects, isProjectsLoading } = useContext(ProjectsContext)!;

	const { firstName, lastName, email } = userProfile || {};

	if (isProjectsLoading) return <h1>Loading...</h1>;

	return (
		<>
			<section>
				<div>avatar</div>
				<h4>{`${email}`}</h4>
				<h1>{`${firstName} ${lastName}`}</h1>
			</section>

			<section>
				<ul>
					{projects?.map((project) => {
						return <ProjectLink project={project} />;
					})}
				</ul>
			</section>
		</>
	);
};

export default Preview;
