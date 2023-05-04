import styles from './Content.module.css';
import { Sidebar, Menu, MenuItem } from 'react-pro-sidebar';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
	faCalendarPlus,
	faHome,
	faList,
	faSignOut,
	faTrash,
	faEdit,
	faSpinner,
	faCircleExclamation,
	faCircleCheck,
	faCircleInfo,
} from '@fortawesome/free-solid-svg-icons';
import { Navigate, useNavigate } from 'react-router-dom';
import { useSubscription, useMutation } from '@apollo/client';
import React, { useState, useEffect } from 'react';
import { SUBSCRIBE_LIST, DELETE_LIST, UPDATE_LIST } from './clients/list';
import { LoopCircleLoading } from 'react-loadingg';
import Modal from 'react-awesome-modal';
import { Button } from './components';
import { ToastContainer, toast } from 'react-toastify';
import classNames from 'classnames/bind';
import storage from './utilities/storage';

import 'react-toastify/dist/ReactToastify.css';

export default function Content({ children }) {
	const [selectedData, setSelectedData] = useState({});
	const [showDeleteModal, setShowDeleteModal] = useState(false);
	const [showEditModal, setShowEditModal] = useState(false);
	const [validation, setValidation] = useState({});
	const [hoveredId, setHoveredId] = useState(null);

	const [updatedListName, setUpdatedListName] = useState('');
	const [updatedListDescription, setUpdatedListDescription] = useState('');

	const navigate = useNavigate();
	const isLoggedIn = storage.get('isLoggedIn', false);
	const userId = storage.get('userId', '');

	useEffect(() => {
		setValidation({
			updatedListNameRequired: updatedListName != '',
			updatedListNameLength: updatedListName.length <= 20,
			updatedListDescriptionLength: updatedListDescription.length <= 75,
		});
	}, [updatedListName, updatedListDescription]);

	const { data, loading } = useSubscription(SUBSCRIBE_LIST, {
		variables: {
			user_id: userId,
		},
	});

	const [deleteList, { loading: deleteLoading }] = useMutation(DELETE_LIST, {
		onCompleted: () => {
			toast.success(`List of ${selectedData.name} deleted successfully`, {
				position: toast.POSITION.TOP_RIGHT,
			});
			setShowDeleteModal(false);
		},
		onError: () => {
			toast.error('List could not be deleted. Please try again later', {
				position: toast.POSITION.TOP_RIGHT,
			});
		},
	});

	const [updateList, { loading: updateLoading }] = useMutation(UPDATE_LIST, {
		onCompleted: () => {
			toast.success(`List of ${selectedData.name} updated successfully`, {
				position: toast.POSITION.TOP_RIGHT,
			});
			setShowEditModal(false);
		},

		onError: (error) => {
			console.log(error.message);
			toast.error('List could not be updated. Please try again later', {
				position: toast.POSITION.TOP_RIGHT,
			});
		},
	});

	const handleDelete = () => {
		deleteList({
			variables: {
				id: selectedData.id,
			},
		});
	};

	const handleUpdate = () => {
		updateList({
			variables: {
				id: selectedData.id,
				name: updatedListName,
				description: updatedListDescription,
			},
		});
	};

	const handleLogout = () => {
		storage.clear();
		navigate('/sign-in');
	};

	if (!isLoggedIn) {
		return <Navigate to={'/sign-in'} />;
	}

	if (loading) {
		return <LoopCircleLoading size="large" color="black" />;
	}

	return (
		<div className={styles.container}>
			<Sidebar className={styles.sidebarContainer}>
				<Menu className={styles.sidebar}>
					<div className={styles.menu}>
						<div className={styles.title}>
							<span> L O T I O N . </span>
						</div>
						<MenuItem
							className={styles.link}
							onClick={() => navigate('/')}
							icon={<FontAwesomeIcon icon={faHome} />}
						>
							Home
						</MenuItem>
						{data?.list.map((list) => (
							<MenuItem
								key={list.id}
								className={styles.link}
								icon={<FontAwesomeIcon icon={faList} />}
								onClick={() => navigate(`/list/${list.id}`)}
								onMouseEnter={() => setHoveredId(list.id)}
								onMouseLeave={() => setHoveredId(null)}
							>
								<div className={styles.menuContainer}>
									{list.name}
									{hoveredId === list.id && (
										<div className={styles.menuAction}>
											<FontAwesomeIcon
												icon={faEdit}
												className={styles.editIcon}
												onClick={() => {
													setSelectedData(list);
													setUpdatedListName(list.name);
													setUpdatedListDescription(list.description);
													setShowEditModal(true);
												}}
											/>
											<FontAwesomeIcon
												icon={faTrash}
												className={styles.trashIcon}
												onClick={() => {
													setSelectedData(list);
													setShowDeleteModal(true);
												}}
											/>
										</div>
									)}
								</div>
							</MenuItem>
						))}
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
						<MenuItem
							className={styles.logout}
							icon={<FontAwesomeIcon icon={faSignOut} />}
							onClick={handleLogout}
						>
							Sign Out
						</MenuItem>
					</div>
				</Menu>
			</Sidebar>
			<div className={styles.content}>{children}</div>
			<Modal
				visible={showDeleteModal}
				height="20%"
				width="40%"
				onClickAway={() => setShowDeleteModal(false)}
			>
				<div className={styles.modal}>
					<div className={styles.modalContent}>
						<span>
							Are you sure you want to delete <strong>{selectedData.name}</strong>?
						</span>
						<div className={styles.buttonModal}>
							<Button type="Primary" clickFunction={handleDelete}>
								{!deleteLoading ? `Yes, I'm sure` : <FontAwesomeIcon icon={faSpinner} spin />}
							</Button>
							<Button
								type="Danger"
								clickFunction={() => {
									setShowDeleteModal(false);
								}}
							>
								No
							</Button>
						</div>
					</div>
				</div>
			</Modal>
			<Modal
				visible={showEditModal}
				height="40%"
				width="70%"
				onClickAway={() => setShowEditModal(false)}
			>
				<div className={styles.modal}>
					<div className={styles.modalContent}>
						<form className={styles.modalForm}>
							<div className={styles.formGroup}>
								<div className={styles.labelContainer}>
									<label htmlFor="updatedListName" className={styles.label}>
										List Name
									</label>
								</div>
								<div className={styles.inputContainer}>
									<div className={styles.icon}>
										<input
											type="text"
											className={styles.input}
											id="updatedListName"
											placeholder="Enter your list name"
											onChange={(event) => {
												setUpdatedListName(event.target.value);
											}}
											value={updatedListName}
										/>
										{validation.updatedListNameLength && validation.updatedListNameRequired ? (
											<FontAwesomeIcon
												className={styles.iconSuccess}
												size="lg"
												icon={faCircleCheck}
											/>
										) : (
											<FontAwesomeIcon
												className={styles.iconError}
												size="lg"
												icon={faCircleExclamation}
											/>
										)}
									</div>
									<span
										className={classNames(
											styles.helpText,
											validation.updatedListNameRequired
												? styles.helpTextSuccess
												: styles.helpTextError
										)}
									>
										<FontAwesomeIcon icon={faCircleInfo} className={styles.helpIcon} />
										this field is required
									</span>
									<span
										className={classNames(
											styles.helpText,
											validation.updatedListNameLength
												? styles.helpTextSuccess
												: styles.helpTextError
										)}
									>
										<FontAwesomeIcon icon={faCircleInfo} className={styles.helpIcon} />
										list name must not exceed 20 characters
									</span>
								</div>
							</div>
							<div className={styles.formGroup}>
								<div className={styles.labelContainer}>
									<label htmlFor="updatedListDescription" className={styles.label}>
										List Description
									</label>
								</div>
								<div className={styles.inputContainer}>
									<div className={styles.icon}>
										<input
											type="text"
											className={styles.input}
											id="updatedListDescription"
											placeholder="Enter your list description"
											onChange={(event) => {
												setUpdatedListDescription(event.target.value);
											}}
											value={updatedListDescription}
										/>
										{validation.updatedListDescriptionLength ? (
											<FontAwesomeIcon
												className={styles.iconSuccess}
												size="lg"
												icon={faCircleCheck}
											/>
										) : (
											<FontAwesomeIcon
												className={styles.iconError}
												size="lg"
												icon={faCircleExclamation}
											/>
										)}
									</div>
									<span
										className={classNames(
											styles.helpText,
											validation.updatedListDescriptionLength
												? styles.helpTextSuccess
												: styles.helpTextError
										)}
									>
										<FontAwesomeIcon icon={faCircleInfo} className={styles.helpIcon} />
										list description must not exceed 75 characters
									</span>
								</div>
							</div>
						</form>
						<div className={styles.buttonModal}>
							<Button
								type={Object.values(validation).includes(false) ? 'Disabled' : 'Primary'}
								clickFunction={handleUpdate}
							>
								{!updateLoading ? `Update` : <FontAwesomeIcon icon={faSpinner} spin />}
							</Button>
							<Button
								type="Danger"
								clickFunction={() => {
									setShowEditModal(false);
								}}
							>
								Cancel
							</Button>
						</div>
					</div>
				</div>
			</Modal>
			<ToastContainer />
		</div>
	);
}
