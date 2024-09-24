import { ReactNode } from "react";
import { useLocation } from "react-router-dom";
import styles from "./Navbar.module.scss";
import LogoBanner from "../LogoBanner/LogoBanner";
import CustomLink from "../CustomLink/CustomLink";
import Icon from "../Icon";

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
				<span className={`${styles.right_logo} ${styles.navbar_logos}`}>
					<Icon variant='eye' />
					<p>preview</p>
				</span>
			</div>
		</nav>
	);
};

export default Navbar;
