import { ReactNode, useContext, useEffect, useRef } from "react";
import styles from "./DashboardLayout.module.scss";

import { UserContext } from "../../contexts/UserContext";

import Icon from "../../components/common/Icon";
import Navbar from "../../components/common/Navbar/Navbar";
import { Button } from "../../components/common/Button/Button";
import { useLocation, useNavigate } from "react-router-dom";

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
	const { isUserPending, isProfileComplete } = useContext(UserContext);
	const navigate = useNavigate();
	const location = useLocation();

	const dialogRef = useRef<HTMLDialogElement>(null);

	const handleCloseDialog = () => {
		dialogRef.current?.close();
	};

	useEffect(() => {
		const mainDashboardPage = location.pathname === "/dashboard";
		if (!isProfileComplete && mainDashboardPage) {
			dialogRef.current?.showModal();
		}
	}, [isProfileComplete, location.pathname]);

	return (
		<div className={styles.dashboard_layout}>
			<div>
				<Navbar navigationLinks={dashboardLinks} className={styles.navbar} />
				<main>
					{isUserPending ? <h1>Loading...</h1> : children}
					{!isProfileComplete && (
						<dialog ref={dialogRef}>
							<div className={styles.dialog__content}>
								<div>
									<h2>Please complete your profile</h2>
								</div>
								<div className={styles.dialog__actionBtns}>
									<Button
										variant='default'
										onClick={() => navigate("/dashboard/profile")}
									>
										Profile
									</Button>
									<Button variant='secondary' onClick={handleCloseDialog}>
										Skip
									</Button>
								</div>
							</div>
						</dialog>
					)}
				</main>
			</div>
		</div>
	);
};

export default DashboardLayout;
