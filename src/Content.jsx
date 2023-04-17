import styles from './Content.module.css';
import { Sidebar, Menu, MenuItem } from 'react-pro-sidebar';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendarPlus, faHome, faList, faSignOut } from '@fortawesome/free-solid-svg-icons';
import { Navigate, useNavigate } from 'react-router-dom';
import { CATEGORY } from './constant';
import React, { useState } from 'react';

export default function Content({ children }) {
	const [isLoggedIn, setIsLoggedIn] = useState(true);
	const navigate = useNavigate();

	if (!isLoggedIn) {
		return <Navigate to={'/sign-in'} />;
	}

	return (
		<div className={styles.container}>
			<Sidebar className={styles.sidebarContainer}>
				<Menu className={styles.sidebar}>
					<div className={styles.menu}>
						<div className={styles.title}>
							{/* TODO use name from login's credentials */}
							<span> L O T I O N . </span>
						</div>
						<MenuItem
							className={styles.link}
							onClick={() => navigate('/')}
							icon={<FontAwesomeIcon icon={faHome} />}
						>
							Home
						</MenuItem>
						{
							// TODO add list from database
							CATEGORY.map((list) => (
								<MenuItem
									key={list.id}
									className={styles.link}
									icon={<FontAwesomeIcon icon={faList} />}
								>
									{list.name}
								</MenuItem>
							))
						}
						<MenuItem
							className={styles.link}
							onClick={() => navigate('/create-list')}
							icon={<FontAwesomeIcon icon={faCalendarPlus} />}
						>
							Create New List
						</MenuItem>
					</div>
					<hr className={styles.line}></hr>
					<div className={styles.menu}>
						<MenuItem className={styles.logout} icon={<FontAwesomeIcon icon={faSignOut} />}>
							Sign Out
						</MenuItem>
					</div>
				</Menu>
			</Sidebar>
			<div className={styles.content}>{children}</div>
		</div>
	);
}
