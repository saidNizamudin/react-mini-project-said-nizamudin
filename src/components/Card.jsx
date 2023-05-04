import styles from './Card.module.css';
import classNames from 'classnames/bind';

export default function Card({ children, className, onClick }) {
	return (
		<div className={classNames(styles.card, className)} onClick={onClick}>
			{children}
		</div>
	);
}
