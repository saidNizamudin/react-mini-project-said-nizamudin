import React, { useState, useEffect } from 'react';
import styles from './CreateTask.module.css';
import { EditorState, convertToRaw } from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
import draftToHtml from 'draftjs-to-html';
import Datetime from 'react-datetime';
import CreatableSelect from 'react-select/creatable';
import { Card, Button } from '../../components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
	faCircleExclamation,
	faCircleCheck,
	faCircleInfo,
	faCloudUpload,
	faTrash,
} from '@fortawesome/free-solid-svg-icons';
import moment from 'moment';
import classNames from 'classnames/bind';
import { INSERT_TASK } from '../../clients/task';
import { useParams } from 'react-router-dom';
import storage from '../../utilities/storage';
import { useMutation } from '@apollo/client';

import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import 'react-datetime/css/react-datetime.css';

export default function CreateTask() {
	const [editorState, setEditorState] = useState(() => EditorState.createEmpty());

	const [validation, setValidation] = useState({});
	const [taskDesc, setTaskDesc] = useState({ blocks: [], entityMap: {} });
	const [taskName, setTaskName] = useState('');
	const [taskImage, setTaskImage] = useState('');
	const [taskImageName, setTaskImageName] = useState('');
	const [taskDeadline, setTaskDeadline] = useState('');
	const [taskStatus, setTaskStatus] = useState('');

	const userId = storage.get('userId', '');
	const { id: listId } = useParams();

	const [insertTask, { loading }] = useMutation(INSERT_TASK, {
		onCompleted: (response) => {
			const data = response.insert_task.returning;

			if (data.length > 0) {
				toast.success(`${data[0].name} created successfully`, {
					position: toast.POSITION.TOP_RIGHT,
				});
			} else {
				toast.error('Task could not be created. Please try again later', {
					position: toast.POSITION.TOP_RIGHT,
				});
			}
		},
		onError: () => {
			toast.error('Task could not be created. Please try again later', {
				position: toast.POSITION.TOP_RIGHT,
			});
		},
	});

	useEffect(() => {
		setValidation({
			taskNameRequired: taskName != '',
			taskNameLength: taskName.length <= 20,
			taskDeadlineRequied: taskDeadline != '',
			taskStatusRequied: taskStatus != '',
			taskDeadlineFuture: moment(taskDeadline).isAfter(moment()),
		});
	}, [taskName, taskDeadline, taskStatus]);

	useEffect(() => {
		let editorContent = draftToHtml(convertToRaw(editorState.getCurrentContent()));
		setTaskDesc(editorContent);
	}, [editorState]);

	const getBase64 = (e) => {
		return new Promise((resolve) => {
			let baseURL = '';
			let reader = new FileReader();
			reader.readAsDataURL(e);

			reader.onload = () => {
				baseURL = reader.result;
				resolve(baseURL);
			};
		});
	};

	const handleDeleteImage = () => {
		document.getElementById('taskImage').value = '';
		setTaskImage('');
		setTaskImageName('');
	};

	const handleSubmit = (event) => {
		event.preventDefault();
		insertTask({
			variables: {
				user_id: userId,
				list_id: listId,
				name: taskName,
				description: taskDesc,
				deadline: taskDeadline,
				image: taskImage,
				status: taskStatus,
			},
		});
	};

	return (
		<div>
			<Card className={styles.form}>
				<h1 className={styles.title}>Create New Task</h1>
				<form>
					<div className={styles.formGroup}>
						<div className={styles.labelContainer}>
							<label htmlFor="taskName" className={styles.label}>
								Task Name
							</label>
						</div>
						<div className={styles.inputContainer}>
							<div className={styles.icon}>
								<input
									type="text"
									className={styles.input}
									id="taskName"
									placeholder="Enter your task name"
									onChange={(event) => {
										setTaskName(event.target.value);
									}}
								/>
								{validation.taskNameLength && validation.taskNameRequired ? (
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
									validation.taskNameRequired ? styles.helpTextSuccess : styles.helpTextError
								)}
							>
								<FontAwesomeIcon icon={faCircleInfo} className={styles.helpIcon} />
								this field is required
							</span>
							<span
								className={classNames(
									styles.helpText,
									validation.taskNameLength ? styles.helpTextSuccess : styles.helpTextError
								)}
							>
								<FontAwesomeIcon icon={faCircleInfo} className={styles.helpIcon} />
								task name must not exceed 20 characters
							</span>
						</div>
					</div>
					<div className={styles.formGroup}>
						<div className={styles.labelContainer}>
							<label htmlFor="taskDesc" className={styles.label}>
								Task Description
							</label>
						</div>
						<div className={styles.descContainer}>
							<Editor
								editorState={editorState}
								onEditorStateChange={setEditorState}
								toolbar={{
									options: ['inline', 'list', 'textAlign'],
									placeholder: 'Enter text here...',
								}}
							/>
						</div>
					</div>
					<div className={styles.formGroup}>
						<div className={styles.labelContainer}>
							<label htmlFor="taskImage" className={styles.label}>
								Task Image
							</label>
						</div>
						<div
							className={taskImage ? styles.inputImageContainerFilled : styles.inputImageContainer}
						>
							{taskImage ? (
								<FontAwesomeIcon
									icon={faTrash}
									className={styles.deleteImageIcon}
									onClick={handleDeleteImage}
								/>
							) : (
								<FontAwesomeIcon icon={faCloudUpload} className={styles.uploadIcon} />
							)}
							{taskImage ? taskImageName : 'Input your image'}
							<input
								type="file"
								id="taskImage"
								accept={['image/jpg', 'image/jpeg', 'image/png']}
								onChange={(e) => {
									setTaskImageName(e.target.files[0].name);
									getBase64(e.target.files[0])
										.then((result) => {
											setTaskImage(result);
										})
										.catch(() => {
											setTaskImage('notFound');
										});
								}}
							/>
						</div>
					</div>
					<div className={styles.formGroup}>
						<div className={styles.labelContainer}>
							<label htmlFor="taskDeadline" className={styles.label}>
								Deadline
							</label>
						</div>
						<div className={styles.inputContainer}>
							<div className={styles.icon}>
								<Datetime
									inputProps={{ placeholder: 'Input your task deadline' }}
									onChange={(event) => {
										const timestamp = moment(event);
										setTaskDeadline(timestamp.isValid() ? timestamp.valueOf() : '');
									}}
									className={styles.dateTime}
									closeOnSelect
									closeOnClickOutside
								/>
								{validation.taskDeadlineRequied && validation.taskDeadlineFuture ? (
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
									validation.taskDeadlineRequied ? styles.helpTextSuccess : styles.helpTextError
								)}
							>
								<FontAwesomeIcon icon={faCircleInfo} className={styles.helpIcon} />
								this field is required
							</span>
							<span
								className={classNames(
									styles.helpText,
									validation.taskDeadlineFuture ? styles.helpTextSuccess : styles.helpTextError
								)}
							>
								<FontAwesomeIcon icon={faCircleInfo} className={styles.helpIcon} />
								input a future date
							</span>
						</div>
					</div>
					<div className={styles.formGroup}>
						<div className={styles.labelContainer}>
							<label htmlFor="taskStatus" className={styles.label}>
								Status
							</label>
						</div>
						<div className={styles.inputContainer}>
							<div className={styles.icon}>
								<CreatableSelect
									className={styles.select}
									options={[
										{ value: 'To Do', label: 'To Do' },
										{ value: 'In Progress', label: 'In Progress' },
										{ value: 'Done', label: 'Done' },
									]}
									components={{ DropdownIndicator: null }}
									isClearable
									placeholder="Select your task status"
									onChange={(event) => {
										setTaskStatus(event ? event.value : '');
									}}
								/>
								{validation.taskStatusRequied ? (
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
									validation.taskStatusRequied ? styles.helpTextSuccess : styles.helpTextError
								)}
							>
								<FontAwesomeIcon icon={faCircleInfo} className={styles.helpIcon} />
								this field is required
							</span>
						</div>
					</div>
					<Button
						type={Object.values(validation).includes(false) ? 'Disabled' : 'Primary'}
						clickFunction={handleSubmit}
					>
						<strong>Create</strong>
					</Button>
				</form>
			</Card>
		</div>
	);
}
