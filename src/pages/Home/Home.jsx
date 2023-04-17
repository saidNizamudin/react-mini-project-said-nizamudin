import React, { useEffect } from 'react';
import styles from './Home.module.css';
import { Card } from '../../components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCirclePlus } from '@fortawesome/free-solid-svg-icons';
import { CATEGORY } from '../../constant';
import { dateFromNow } from '../../utilities/date_from_now';

export default function Home() {
	return (
		<div className={styles.container}>
			<div className={styles.header}>
				<Card className={styles.createCard}>
					<FontAwesomeIcon icon={faCirclePlus} className={styles.icon} />
					<div className={styles.textHeader}>
						<h2 className={styles.title}>
							<strong>Hello, Said</strong>
						</h2>
						<span className={styles.createText}>Create New List</span>
					</div>
				</Card>
				<Card className={styles.statsCard}></Card>
			</div>
			<div className={styles.wrapper}>
				{CATEGORY.map((item, index) => {
					return (
						<Card key={index} className={styles.listCard}>
							<div className={styles.cardContent}>
								<div className={styles.listCardHeader}>
									<h3 className={styles.listCardTitle}>{item.name}</h3>
								</div>
								<div className={styles.listCardContent}>
									<p className={styles.listCardText}>{item.description}</p>
								</div>
							</div>
							<div className={styles.listCardFooter}>{dateFromNow(item.createdAt)}</div>
						</Card>
					);
				})}
			</div>
		</div>
	);
}
