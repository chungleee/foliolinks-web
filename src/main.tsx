import React from "react";
import ReactDOM from "react-dom/client";
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
					<AddLinks />
				</UserProvider>
			</ProtectedRoute>
		),
	},
	{
		path: "/dashboard/profile",
		element: (
			<ProtectedRoute>
				<UserProvider>
					<Profile />
				</UserProvider>
			</ProtectedRoute>
		),
	},
	{ path: "/login", element: <Login /> },
	{ path: "/register", element: <Register /> },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
	<React.StrictMode>
		<QueryClientProvider client={queryClient}>
			<RouterProvider router={router} />
		</QueryClientProvider>
	</React.StrictMode>
);
