import React, { useState, useEffect } from 'react';
import styles from './CreateList.module.css';
import { Card, Button } from '../../components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
	faCircleExclamation,
	faCircleCheck,
	faCircleInfo,
} from '@fortawesome/free-solid-svg-icons';
import classNames from 'classnames/bind';

export default function CreateList() {
	const [validation, setValidation] = useState({});
	const [listName, setListName] = useState('');
	const [listDescription, setListDescription] = useState('');

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
					<Button type={Object.values(validation).includes(false) ? 'Disabled' : 'Primary'}>
						<strong>Create</strong>
					</Button>
				</form>
			</Card>
		</div>
	);
}
