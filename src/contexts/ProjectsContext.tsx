import { createContext, ReactNode } from "react";
import { CreateProjects, Project } from "../types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createProjects, getProjects } from "../api/projects";

interface ProjectsContextType {
	projects: Project[] | undefined;
	isProjectsLoading: boolean;
	createProjects: (newProjects: CreateProjects) => void;
}

export const ProjectsContext = createContext<ProjectsContextType | undefined>(
	undefined
);

export const ProjectsProvider = ({ children }: { children: ReactNode }) => {
	const queryClient = useQueryClient();

	const { data: projects, isLoading: isProjectsLoading } = useQuery({
		queryKey: ["projects"],
		queryFn: getProjects,
	});

	const createProjectsMutation = useMutation({
		mutationFn: createProjects,
		onSuccess: (data) => {
			queryClient.setQueryData(["projects"], (prevProjects: Project[]) => {
				return [...prevProjects, ...data];
			});
		},
	});

	return (
		<ProjectsContext.Provider
			value={{
				projects,
				isProjectsLoading,
				createProjects: (data) => createProjectsMutation.mutate(data),
			}}
		>
			{children}
		</ProjectsContext.Provider>
	);
};
