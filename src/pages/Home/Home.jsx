import React, { useEffect } from 'react';
import styles from './Home.module.css';
import { Card } from '../../components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCirclePlus } from '@fortawesome/free-solid-svg-icons';
import { dateFromNow } from '../../utilities/date';
import { useSubscription } from '@apollo/client';
import { SUBSCRIBE_LIST } from '../../clients/list';
import { LoopCircleLoading } from 'react-loadingg';
import { useNavigate } from 'react-router-dom';
import storage from '../../utilities/storage';

export default function Home() {
	const userId = storage.get('userId', '');
	const user = storage.get('username', '');
	const Navigate = useNavigate();

	const { data, loading } = useSubscription(SUBSCRIBE_LIST, {
		variables: {
			user_id: userId,
		},
	});

	if (loading) {
		return <LoopCircleLoading size="large" color="black" />;
	}

	return (
		<div className={styles.container}>
			<div className={styles.header}>
				<Card
					className={styles.createCard}
					onClick={() => {
						Navigate('/create-list');
					}}
				>
					<FontAwesomeIcon icon={faCirclePlus} className={styles.icon} />
					<div className={styles.textHeader}>
						<h2 className={styles.title}>
							<strong>Hello, {user}</strong>
						</h2>
						<span className={styles.createText}>Create New List</span>
					</div>
				</Card>
				<Card className={styles.statsCard}></Card>
			</div>
			<div className={styles.wrapper}>
				{data?.list.map((item, index) => {
					return (
						<Card
							key={index}
							className={styles.listCard}
							onClick={() => {
								Navigate(`/list/${item.id}`);
							}}
						>
							<div className={styles.cardContent}>
								<div className={styles.listCardHeader}>
									<h3 className={styles.listCardTitle}>{item.name}</h3>
								</div>
								<div className={styles.listCardContent}>
									<p className={styles.listCardText}>{item.description}</p>
								</div>
							</div>
							<div className={styles.listCardFooter}>{dateFromNow(item.created_at)}</div>
						</Card>
					);
				})}
			</div>
		</div>
	);
}
