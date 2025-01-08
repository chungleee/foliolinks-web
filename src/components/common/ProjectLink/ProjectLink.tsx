import { Project } from "../../../types";
import { ProjectButton } from "../Button/Button";

interface ProjectLinkProp {
	project: Project;
}

const ProjectLink = ({ project }: ProjectLinkProp) => {
	return (
		<ProjectButton url={project.project_url}>
			{project.project_name}
		</ProjectButton>
	);
};

export default ProjectLink;
