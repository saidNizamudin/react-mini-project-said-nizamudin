import React, { useState, useEffect } from 'react';
import styles from './UpdateTask.module.css';
import { EditorState, convertToRaw, convertFromRaw } from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
import Datetime from 'react-datetime';
import CreatableSelect from 'react-select/creatable';
import Card from '../../components/Card';
import Button from '../../components/Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
	faCircleExclamation,
	faCircleCheck,
	faCircleInfo,
	faTrash,
	faSpinner,
	faAdd,
	faEye,
} from '@fortawesome/free-solid-svg-icons';
import moment from 'moment';
import classNames from 'classnames/bind';
import { UPDATE_TASK, GET_TASK_BY_ID } from '../../clients/task';
import { useParams, useNavigate } from 'react-router-dom';
import storage from '../../utilities/storage';
import { useMutation, useQuery } from '@apollo/client';
import { ToastContainer, toast } from 'react-toastify';
import { LoopCircleLoading } from 'react-loadingg';
import Lightbox from 'react-awesome-lightbox';
import Modal from 'react-awesome-modal';

import 'react-awesome-lightbox/build/style.css';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import 'react-datetime/css/react-datetime.css';
import 'react-toastify/dist/ReactToastify.css';

export default function UpdateTask() {
	const [editorState, setEditorState] = useState(() => EditorState.createEmpty());

	const [validation, setValidation] = useState({});
	const [taskDesc, setTaskDesc] = useState({ blocks: [], entityMap: {} });
	const [taskName, setTaskName] = useState('');
	const [taskImage, setTaskImage] = useState([]);
	const [taskDeadline, setTaskDeadline] = useState('');
	const [taskStatus, setTaskStatus] = useState('');
	const [showLightbox, setShowLightbox] = useState(false);
	const [showDeleteModal, setShowDeleteModal] = useState(false);
	const [selectedImage, setSelectedImage] = useState({});
	const [imageShown, setImageShown] = useState({});

	const userId = storage.get('userId', '');
	const { id: listId, taskId } = useParams();
	const navigate = useNavigate();

	const { loading: loadingFetching, data: taskData } = useQuery(GET_TASK_BY_ID, {
		variables: {
			id: taskId,
		},
	});

	const [updateTask, { loading }] = useMutation(UPDATE_TASK, {
		onCompleted: (response) => {
			const data = response.update_task.returning;

			if (data.length > 0) {
				toast.success(`${data[0].name} updated successfully`, {
					position: toast.POSITION.TOP_RIGHT,
				});
				navigate(`/list/${listId}`);
			} else {
				toast.error('Task could not be updated. Please try again later', {
					position: toast.POSITION.TOP_RIGHT,
				});
			}
		},
		onError: () => {
			toast.error('Task could not be updated. Please try again later', {
				position: toast.POSITION.TOP_RIGHT,
			});
		},
	});

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

	const handleSubmit = (event) => {
		event.preventDefault();
		updateTask({
			variables: {
				id: taskId,
				user_id: userId,
				list_id: listId,
				name: taskName,
				description: taskDesc,
				deadline: new Date(taskDeadline).toISOString(),
				image: JSON.stringify(taskImage),
				status: taskStatus,
			},
		});
	};

	useEffect(() => {
		setValidation({
			taskNameRequired: taskName != '',
			taskNameLength: taskName.length <= 20,
			taskDeadlineRequied: taskDeadline != '',
			taskStatusRequied: taskStatus != '',
		});
	}, [taskName, taskDeadline, taskStatus]);

	useEffect(() => {
		let editorContent = JSON.stringify(convertToRaw(editorState.getCurrentContent()));
		setTaskDesc(editorContent);
	}, [editorState]);

	useEffect(() => {
		if (taskData) {
			const data = taskData.task[0];
			setTaskName(data.name);
			setTaskStatus(data.status);
			setTaskDeadline(moment(data.deadline).valueOf());
			setEditorState(EditorState.createWithContent(convertFromRaw(JSON.parse(data.description))));
			setTaskImage(JSON.parse(data.image));
		}
	}, [taskData]);

	if (loadingFetching) {
		return <LoopCircleLoading size="large" color="black" />;
	}

	return (
		<div>
			<Card className={styles.form}>
				<h1 className={styles.title}>Update {taskName}</h1>
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
									value={taskName}
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
								stripPastedStyles={true}
							/>
						</div>
					</div>
					<div className={styles.formGroup}>
						<div className={styles.labelContainer}>
							<label htmlFor="taskImage" className={styles.label}>
								Task Image
							</label>
						</div>
						{/* <div
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
							
						</div> */}
						<div className={styles.imageContainer}>
							{taskImage &&
								taskImage.map((image, index) => {
									return (
										<div className={styles.imagePill} key={index}>
											Photo {index + 1}
											<FontAwesomeIcon
												icon={faEye}
												className={styles.viewImageIcon}
												onClick={() => {
													setShowLightbox(true);
													setImageShown({
														url: image,
														title: `Photo ${index + 1}`,
													});
												}}
											/>
											<FontAwesomeIcon
												icon={faTrash}
												className={styles.deleteImageIcon}
												onClick={() => {
													setShowDeleteModal(true);
													setSelectedImage({
														name: `Photo ${index + 1}`,
														url: image,
													});
												}}
											/>
										</div>
									);
								})}
							{taskImage.length < 3 && (
								<div className={styles.addImageContainer}>
									<FontAwesomeIcon icon={faAdd} className={styles.addImageIcon} />
									<input
										type="file"
										id="taskImage"
										accept={['image/jpg', 'image/jpeg', 'image/png']}
										onChange={(e) => {
											const files = e.target.files;
											getBase64(files[0])
												.then((result) => {
													setTaskImage([...taskImage, result]);
												})
												.catch(() => {
													return 'notFound';
												});
										}}
										className={styles.addImageInput}
									/>
								</div>
							)}
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
									value={taskDeadline}
								/>
								{validation.taskDeadlineRequied ? (
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
									value={{ value: taskStatus, label: taskStatus }}
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
						{loading ? <FontAwesomeIcon icon={faSpinner} spin /> : <strong>Update</strong>}
					</Button>
				</form>
			</Card>
			{showLightbox && (
				<Lightbox
					image={imageShown.url}
					title={imageShown.title}
					onClose={() => {
						setShowLightbox(false);
						setImageShown('');
					}}
				/>
			)}
			<ToastContainer />
			<Modal
				visible={showDeleteModal}
				height="20%"
				width="40%"
				onClickAway={() => setShowDeleteModal(false)}
			>
				<div className={styles.modal}>
					<div className={styles.modalContent}>
						<span>
							Are you sure you want to delete <strong>{selectedImage.name}</strong>?
						</span>
						<div className={styles.buttonModal}>
							<Button
								type="Primary"
								clickFunction={() => {
									setTaskImage(taskImage.filter((image) => image != selectedImage.url));
									setShowDeleteModal(false);
								}}
							>
								Yes, I'm sure
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
		</div>
	);
}
