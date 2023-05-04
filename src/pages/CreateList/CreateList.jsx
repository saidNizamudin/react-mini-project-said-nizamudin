import React, { useState, useEffect } from 'react';
import styles from './CreateList.module.css';
import { Card, Button } from '../../components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
	faCircleExclamation,
	faCircleCheck,
	faCircleInfo,
	faSpinner,
} from '@fortawesome/free-solid-svg-icons';
import classNames from 'classnames/bind';
import { useMutation } from '@apollo/client';
import { INSERT_LIST } from '../../clients/list';
import { ToastContainer, toast } from 'react-toastify';
import storage from '../../utilities/storage';

import 'react-toastify/dist/ReactToastify.css';

export default function CreateList() {
	const [validation, setValidation] = useState({});
	const [listName, setListName] = useState('');
	const [listDescription, setListDescription] = useState('');
	const userId = storage.get('userId', '');

	const [insertList, { loading }] = useMutation(INSERT_LIST, {
		onCompleted: (response) => {
			const data = response.insert_list.returning;

			if (data.length > 0) {
				toast.success(`List of ${data[0].name} created successfully`, {
					position: toast.POSITION.TOP_RIGHT,
				});
			} else {
				toast.error('List could not be created. Please try again later', {
					position: toast.POSITION.TOP_RIGHT,
				});
			}
		},
		onError: () => {
			toast.error('List could not be created. Please try again later', {
				position: toast.POSITION.TOP_RIGHT,
			});
		},
	});

	const handleSubmit = (event) => {
		event.preventDefault();
		insertList({
			variables: {
				user_id: userId,
				name: listName,
				description: listDescription,
			},
		});
	};

	useEffect(() => {
		setValidation({
			listNameRequired: listName != '',
			listNameLength: listName.length <= 20,
			listDescriptionLength: listDescription.length <= 75,
		});
	}, [listName, listDescription]);

	return (
		<div>
			<Card className={styles.form}>
				<h1 className={styles.title}>Create New List</h1>
				<form>
					<div className={styles.formGroup}>
						<div className={styles.labelContainer}>
							<label htmlFor="listName" className={styles.label}>
								List Name
							</label>
						</div>
						<div className={styles.inputContainer}>
							<div className={styles.icon}>
								<input
									type="text"
									className={styles.input}
									id="listName"
									placeholder="Enter your list name"
									onChange={(event) => {
										setListName(event.target.value);
									}}
								/>
								{validation.listNameLength && validation.listNameRequired ? (
									<FontAwesomeIcon className={styles.iconSuccess} size="lg" icon={faCircleCheck} />
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
									validation.listNameRequired ? styles.helpTextSuccess : styles.helpTextError
								)}
							>
								<FontAwesomeIcon icon={faCircleInfo} className={styles.helpIcon} />
								this field is required
							</span>
							<span
								className={classNames(
									styles.helpText,
									validation.listNameLength ? styles.helpTextSuccess : styles.helpTextError
								)}
							>
								<FontAwesomeIcon icon={faCircleInfo} className={styles.helpIcon} />
								list name must not exceed 20 characters
							</span>
						</div>
					</div>
					<div className={styles.formGroup}>
						<div className={styles.labelContainer}>
							<label htmlFor="listDescription" className={styles.label}>
								List Description
							</label>
						</div>
						<div className={styles.inputContainer}>
							<div className={styles.icon}>
								<input
									type="text"
									className={styles.input}
									id="listDescription"
									placeholder="Enter your list description"
									onChange={(event) => {
										setListDescription(event.target.value);
									}}
								/>
								{validation.listDescriptionLength ? (
									<FontAwesomeIcon className={styles.iconSuccess} size="lg" icon={faCircleCheck} />
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
									validation.listDescriptionLength ? styles.helpTextSuccess : styles.helpTextError
								)}
							>
								<FontAwesomeIcon icon={faCircleInfo} className={styles.helpIcon} />
								list description must not exceed 75 characters
							</span>
						</div>
					</div>
					<Button
						type={Object.values(validation).includes(false) ? 'Disabled' : 'Primary'}
						clickFunction={handleSubmit}
					>
						{loading ? <FontAwesomeIcon icon={faSpinner} spin /> : <strong>Create</strong>}
					</Button>
				</form>
			</Card>
			<ToastContainer />
		</div>
	);
}
