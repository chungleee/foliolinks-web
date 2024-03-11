import {
	FiLink,
	FiMail,
	FiLock,
	FiArrowDown,
	FiArrowUp,
	FiUser,
	FiEye,
	FiZap,
	FiImage,
} from "react-icons/fi";

type Variants =
	| "link"
	| "mail"
	| "lock"
	| "down-arrow"
	| "up-arrow"
	| "user"
	| "eye"
	| "zap"
	| "image";

interface IconProps {
	variant?: Variants;
	className?: string;
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
		case "user": {
			return <FiUser {...props} />;
		}
		case "eye": {
			return <FiEye {...props} />;
		}
		case "zap": {
			return <FiZap {...props} />;
		}

		case "image": {
			return <FiImage {...props} />;
		}

		default: {
			return null;
		}
	}
};

export default Icon;
