import styles from './Card.module.css';
import classNames from 'classnames/bind';

export default function Card({ children, className }) {
	return <div className={classNames(styles.card, className)}>{children}</div>;
}
