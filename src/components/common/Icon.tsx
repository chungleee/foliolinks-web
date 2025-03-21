import { CSSProperties } from "react";
import {
	FiLink,
	FiMail,
	FiLock,
	FiArrowDown,
	FiArrowUp,
	FiArrowRight,
	FiUser,
	FiEye,
	FiEyeOff,
	FiZap,
	FiImage,
	FiLogOut,
	FiSettings,
	FiXCircle,
} from "react-icons/fi";

type Variants =
	| "link"
	| "mail"
	| "lock"
	| "down-arrow"
	| "up-arrow"
	| "right-arrow"
	| "user"
	| "eye"
	| "eyeOff"
	| "zap"
	| "image"
	| "logout"
	| "settings"
	| "close";

interface IconProps {
	variant?: Variants;
	className?: string;
	style?: CSSProperties;
}

const Icon = ({ variant, ...props }: IconProps) => {
	switch (variant) {
		case "link": {
			return <FiLink {...props} />;
		}
		case "mail": {
			return <FiMail {...props} />;
		}
		case "lock": {
			return <FiLock {...props} />;
		}
		case "down-arrow": {
			return <FiArrowDown {...props} />;
		}
		case "up-arrow": {
			return <FiArrowUp {...props} />;
		}
		case "right-arrow": {
			return <FiArrowRight {...props} />;
		}
		case "user": {
			return <FiUser {...props} />;
		}
		case "eye": {
			return <FiEye {...props} />;
		}
		case "eyeOff": {
			return <FiEyeOff {...props} />;
		}
		case "zap": {
			return <FiZap {...props} />;
		}
		case "image": {
			return <FiImage {...props} />;
		}
		case "logout": {
			return <FiLogOut {...props} />;
		}
		case "settings": {
			return <FiSettings {...props} />;
		}
		case "close": {
			return <FiXCircle {...props} />;
		}
		default: {
			return null;
		}
	}
};

export default Icon;
