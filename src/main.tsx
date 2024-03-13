import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import App from "./App.tsx";
import "./global.scss";
import AddLinks from "./pages/Dashboard/AddLinks/AddLinks.tsx";
import Login from "./pages/Auth/Login/Login.tsx";
import Register from "./pages/Auth/Register/Register.tsx";
import Profile from "./pages/Dashboard/Profile/Profile.tsx";

const router = createBrowserRouter([
	{
		path: "/",
		element: <App />,
	},
	{ path: "/dashboard", element: <AddLinks /> },
	{ path: "/dashboard/profile", element: <Profile /> },
	{ path: "/login", element: <Login /> },
	{ path: "/register", element: <Register /> },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
	<React.StrictMode>
		<RouterProvider router={router} />
	</React.StrictMode>
);
