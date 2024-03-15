import Icon from "../../components/common/Icon";
import Navbar from "../../components/common/Navbar/Navbar";
import styles from "./DashboardLayout.module.scss";
import { ReactNode } from "react";

const dashboardLinks = [
	{ href: "/dashboard", name: "Links", icon: <Icon variant='link' /> },
	{
		href: "/dashboard/profile",
		name: "Profile",
		icon: <Icon variant='user' />,
	},
];

const DashboardLayout = ({ children }: { children: ReactNode }) => {
	return (
		<div className={styles.dashboard_layout}>
			<div>
				<Navbar navigationLinks={dashboardLinks} className={styles.navbar} />
				<main>{children}</main>
			</div>
		</div>
	);
};

export default DashboardLayout;
