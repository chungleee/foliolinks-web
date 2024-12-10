import { createContext, ReactNode, useContext } from "react";
import { CreateProjects, Project } from "../types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
	createProjectsAPI,
	deleteProjectAPI,
	getProjectsAPI,
	updateProjectAPI,
} from "../api/projects";
import { UserContext } from "./UserContext";

interface ProjectsContextType {
	projects: Project[] | undefined;
	isProjectsLoading: boolean;
	createProjects: (newProjects: CreateProjects) => void;
	updateProject: (project: Project) => void;
	deleteProject: (project: Project) => void;
}

export const ProjectsContext = createContext<ProjectsContextType | undefined>(
	undefined
);

export const ProjectsProvider = ({ children }: { children: ReactNode }) => {
	const { userProfile } = useContext(UserContext);
	const queryClient = useQueryClient();

	const id = userProfile?.id;

	const { data: projects, isLoading: isProjectsLoading } = useQuery({
		queryKey: ["projects", id],
		queryFn: getProjectsAPI,
		enabled: !!id,
	});

	const createProjectsMutation = useMutation({
		mutationFn: createProjectsAPI,
		onSuccess: (data) => {
			queryClient.setQueryData(["projects", id], (prevProjects: Project[]) => {
				return [...prevProjects, ...data];
			});
		},
	});

	const updateProjectMutation = useMutation({
		mutationFn: updateProjectAPI,
		onSuccess: (data) => {
			const updatedProjects = projects?.map((project) => {
				if (project.id === data?.id) {
					return (project = {
						...data,
					});
				}
				return project;
			});
			queryClient.setQueryData(["projects", id], () => {
				return updatedProjects;
			});
		},
	});

	const deleteProjectMutation = useMutation({
		mutationFn: deleteProjectAPI,
		onSuccess: (data) => {
			queryClient.setQueryData(["projects", id], (prevProjects: Project[]) => {
				return prevProjects.filter((p) => {
					return p.id !== data?.project.id;
				});
			});
		},
	});

	return (
		<ProjectsContext.Provider
			value={{
				projects,
				isProjectsLoading,
				createProjects: (data) => createProjectsMutation.mutate(data),
				updateProject: (data) => updateProjectMutation.mutate(data),
				deleteProject: (data) => deleteProjectMutation.mutate(data),
			}}
		>
			{children}
		</ProjectsContext.Provider>
	);
};
