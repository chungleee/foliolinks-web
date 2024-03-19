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
				<AddLinks />
			</ProtectedRoute>
		),
	},
	{
		path: "/dashboard/profile",
		element: (
			<ProtectedRoute>
				<Profile />
			</ProtectedRoute>
		),
	},
	{ path: "/login", element: <Login /> },
	{ path: "/register", element: <Register /> },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
	<React.StrictMode>
		<RouterProvider router={router} />
	</React.StrictMode>
);
