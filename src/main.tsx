import React from "react";
import ReactDOM from "react-dom/client";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import App from "./App.tsx";
import "./global.scss";
import AddLinks from "./pages/Dashboard/AddLinks/AddLinks.tsx";
import Login from "./pages/Auth/Login/Login.tsx";
import Register from "./pages/Auth/Register/Register.tsx";
import Profile from "./pages/Dashboard/Profile/Profile.tsx";
import NotFound from "./pages/NotFound.tsx";
import ProtectedRoute from "./pages/ProtectedRoute.tsx";
import { UserProvider } from "./contexts/UserContext.tsx";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ProjectsProvider } from "./contexts/ProjectsContext.tsx";
import CreateUserAccount from "./pages/Auth/Register/CreateUserAccount/CreateUserAccount.tsx";
import CreateUserInfo from "./pages/Auth/Register/CreateUserProfile/CreateUserProfile.tsx";
import Preview from "./pages/Dashboard/Preview/Preview.tsx";

const queryClient = new QueryClient();

const router = createBrowserRouter([
	{ path: "*", element: <NotFound /> },
	{
		path: "/",
		element: <App />,
	},
	{
		path: "/dashboard",
		element: (
			<ProtectedRoute>
				<UserProvider>
					<ProjectsProvider>
						<AddLinks />
					</ProjectsProvider>
				</UserProvider>
			</ProtectedRoute>
		),
	},
	{
		path: "/dashboard/profile",
		element: (
			<ProtectedRoute>
				<UserProvider>
					<ProjectsProvider>
						<Profile />
					</ProjectsProvider>
				</UserProvider>
			</ProtectedRoute>
		),
	},
	{
		path: "/dashboard/preview",
		element: (
			<ProtectedRoute>
				<UserProvider>
					<ProjectsProvider>
						<Preview />
					</ProjectsProvider>
				</UserProvider>
			</ProtectedRoute>
		),
	},
	{ path: "/login", element: <Login /> },
	{
		path: "/register",
		element: <Register />,
		children: [
			{ path: "", element: <CreateUserAccount /> },
			{ path: "userinfo", element: <CreateUserInfo /> },
		],
	},
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
	<React.StrictMode>
		<QueryClientProvider client={queryClient}>
			<ReactQueryDevtools initialIsOpen={false} />
			<RouterProvider router={router} />
		</QueryClientProvider>
	</React.StrictMode>
);
