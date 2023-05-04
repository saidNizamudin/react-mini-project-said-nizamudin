import styles from './Button.module.css';
import classNames from 'classnames/bind';

export default function Button({ clickFunction, type, children, className }) {
	const colorStyle = (type) => {
		switch (type) {
			case 'Primary':
				return styles.primary;
			case 'Secondary':
				return styles.secondary;
			case 'Danger':
				return styles.danger;
			default:
				return;
		}
	};

	return (
		<button
			disabled={type == 'Disabled'}
			className={classNames(styles.button, colorStyle(type), className)}
			onClick={type == 'Disabled' ? () => {} : clickFunction}
		>
			{children}
		</button>
	);
}
