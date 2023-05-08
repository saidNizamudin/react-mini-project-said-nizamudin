import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import styles from './Pill.module.css';
import classNames from 'classnames/bind';
import { faPlusCircle } from '@fortawesome/free-solid-svg-icons';

export default function Pill({ isDone, isCreate, children, onClick }) {
	if (isCreate) {
		return (
			<div className={classNames(styles.pill, styles.create)} onClick={onClick}>
				<div className={styles.content}>
					<FontAwesomeIcon icon={faPlusCircle} />
					<span>Create New Task Here?</span>
				</div>
			</div>
		);
	}

	return (
		<>
			<div className={classNames(styles.pill, isDone && styles.done)} onClick={onClick}>
				<div className={styles.content}>{children}</div>
			</div>
		</>
	);
}
