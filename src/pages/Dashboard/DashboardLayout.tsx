import Icon from "../../components/common/Icon";
import Navbar from "../../components/common/Navbar/Navbar";
import { UserContext } from "../../contexts/UserContext";
import styles from "./DashboardLayout.module.scss";
import { ReactNode, useContext } from "react";

const dashboardLinks = [
	{ href: "/dashboard", name: "Links", icon: <Icon variant='link' /> },
	{
		href: "/dashboard/profile",
		name: "Profile",
		icon: <Icon variant='user' />,
	},
	{
		href: "/dashboard/settings",
		name: "Settings",
		icon: <Icon variant='settings' />,
	},
];

const DashboardLayout = ({ children }: { children: ReactNode }) => {
	const { isUserPending } = useContext(UserContext);

	return (
		<div className={styles.dashboard_layout}>
			<div>
				<Navbar navigationLinks={dashboardLinks} className={styles.navbar} />
				<main>{isUserPending ? <h1>Loading...</h1> : children}</main>
			</div>
		</div>
	);
};

export default DashboardLayout;
