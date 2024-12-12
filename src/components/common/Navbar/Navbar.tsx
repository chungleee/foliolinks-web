import { ReactNode } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import styles from "./Navbar.module.scss";
import LogoBanner from "../LogoBanner/LogoBanner";
import CustomLink from "../CustomLink/CustomLink";
import Icon from "../Icon";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { handleLogoutAPI } from "../../../api/auth";

interface NavbarProps {
	className?: string;
	navigationLinks: {
		href: string;
		name: string;
		icon?: ReactNode;
	}[];
}

const Navbar = ({ navigationLinks, className }: NavbarProps) => {
	const pathname = useLocation().pathname;
	const navigate = useNavigate();
	const queryClient = useQueryClient();

	const logoutMutation = useMutation({
		mutationFn: handleLogoutAPI,
		onSuccess: () => {
			queryClient.clear();
			navigate("/login");
		},
	});

	return (
		<nav className={`${styles.navbar} ${className}`}>
			<div>
				<span className={`${styles.left_logo} ${styles.navbar_logos}`}>
					<LogoBanner />
				</span>
				{navigationLinks.map((link) => {
					const isActive = pathname === link.href;

					return (
						<CustomLink key={link.name} href={link.href} isActive={isActive}>
							{link.icon}
							<span className={styles.customlink_name}>{link.name}</span>
						</CustomLink>
					);
				})}
				<div className={`${styles.right_logo}`}>
					<span className={`${styles.right_logo} ${styles.navbar_logos}`}>
						<Icon variant='eye' />
						<p>preview</p>
					</span>
					<span
						onClick={() => logoutMutation.mutate()}
						className={`${styles.right_logo} ${styles.navbar_logos}
					`}
					>
						<Icon variant='logout' />
						<p>logout</p>
					</span>
				</div>
			</div>
		</nav>
	);
};

export default Navbar;
