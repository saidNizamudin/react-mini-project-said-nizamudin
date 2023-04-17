import styles from './Button.module.css';
import classNames from 'classnames/bind';

export default function Button({ color, children }) {
	const colorStyle = (color) => {
		switch (color) {
			case 'Green':
				return styles.green;
			case 'Yellow':
				return styles.yellow;
			case 'Red':
				return styles.red;
			default:
				return;
		}
	};

	return <div className={classNames(styles.pill, colorStyle)}>{children}</div>;
}
