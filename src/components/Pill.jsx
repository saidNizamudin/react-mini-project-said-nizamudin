import styles from './Pill.module.css';
import classNames from 'classnames/bind';

export default function Pill({ isDone, children, onClick }) {
	return (
		<div className={classNames(styles.pill, isDone && styles.done)} onClick={onClick}>
			<div className={styles.content}>{children}</div>
		</div>
	);
}
