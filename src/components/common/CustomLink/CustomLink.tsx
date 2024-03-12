import { NavLink } from "react-router-dom";
import styles from "./CustomLink.module.scss";
import { ReactNode } from "react";

interface CustomLinkProps {
	href: string;
	isActive?: boolean;
	children: ReactNode;
}

const CustomLink = ({ href, isActive, children }: CustomLinkProps) => {
	return (
		<NavLink
			// className={(isActive) => {
			// 	return isActive
			// 		? `${styles.custom_link} ${styles.active_link}`
			// 		: `${styles.custom_link}`;
			// }}
			className={
				isActive
					? `${styles.custom_link} ${styles.active_link}`
					: `${styles.custom_link}`
			}
			to={href}
		>
			{children}
		</NavLink>
	);
};

export default CustomLink;
