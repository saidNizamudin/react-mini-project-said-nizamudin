import React, { useState } from 'react';
import styles from './ListDetail.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
	faAngleDoubleLeft,
	faClose,
	faEdit,
	faInfoCircle,
	faTrash,
	faSpinner,
	faStar,
	faCheckCircle,
	faStickyNote,
} from '@fortawesome/free-solid-svg-icons';
import moment from 'moment';
import { Pill, Button } from '../../components';
import { findMaxLength } from '../../utilities/find_max_length';
import classNames from 'classnames/bind';
import { useSubscription, useMutation } from '@apollo/client';
import {
	SUBSCRIBE_TASK,
	DELETE_TASK,
	UPDATE_TASK_STATUS,
	UPDATE_TASK_PRIORITY,
} from '../../clients/task';
import { useParams, useNavigate } from 'react-router-dom';
import { LoopCircleLoading } from 'react-loadingg';
import Modal from 'react-awesome-modal';
import { ToastContainer, toast } from 'react-toastify';
import { EditorState, convertFromRaw } from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
import Lightbox from 'react-awesome-lightbox';
import { getCountdown, getLateStatus } from '../../utilities/date';

import 'react-awesome-lightbox/build/style.css';
import 'react-toastify/dist/ReactToastify.css';

export default function ListDetail() {
	const [editorState, setEditorState] = useState(() => EditorState.createEmpty());

	const [selectedTask, setSelectedTask] = useState();
	const [isUseDetail, setIsUseDetail] = useState(false);
	const [showDeleteModal, setShowDeleteModal] = useState(false);
	const [showImageModal, setShowImageModal] = useState(false);

	const { id: listId } = useParams();
	const navigate = useNavigate();

	const { loading, data: taskData } = useSubscription(SUBSCRIBE_TASK, {
		variables: {
			list_id: listId,
		},
	});

	const [deleteTask, { loading: deleteLoading }] = useMutation(DELETE_TASK, {
		onCompleted: () => {
			toast.success(`${selectedTask.name} deleted successfully`, {
				position: toast.POSITION.TOP_RIGHT,
			});
			setShowDeleteModal(false);
			setSelectedTask();
		},
		onError: () => {
			toast.error('Task could not be deleted. Please try again later', {
				position: toast.POSITION.TOP_RIGHT,
			});
		},
	});

	const [updateTaskStatus] = useMutation(UPDATE_TASK_STATUS, {
		onError: () => {
			toast.error('Task status could not be updated. Please try again later', {
				position: toast.POSITION.TOP_RIGHT,
			});
		},
	});

	const [updateTaskPriority] = useMutation(UPDATE_TASK_PRIORITY, {
		onError: () => {
			toast.error('Task priority could not be updated. Please try again later', {
				position: toast.POSITION.TOP_RIGHT,
			});
		},
	});

	const handleDelete = () => {
		deleteTask({
			variables: {
				id: selectedTask.id,
			},
		});
	};

	const data = taskData?.task.reduce(
		(acc, task) => {
			if (task.status === 'To Do') {
				acc.toDo.push(
					<Pill
						onClick={() => {
							setSelectedTask(task);
							setEditorState(() =>
								EditorState.createWithContent(convertFromRaw(JSON.parse(task.description)))
							);
							setIsUseDetail(true);
						}}
					>
						<div className={styles.pillContent}>
							<div className={styles.pillContentText}>
								<span className={styles.pillTitle}>{task.name}</span>
								<span
									className={
										getLateStatus(task.deadline) ? styles.pillCountdownLate : styles.pillCountdown
									}
								>
									{getCountdown(task.deadline)}
								</span>
							</div>
							<div className={styles.pillContentButton}>
								<FontAwesomeIcon
									icon={faStar}
									className={task.is_prioritize ? styles.pillStarSelected : styles.pillButton}
									onClick={(e) => {
										e.stopPropagation();
										updateTaskPriority({
											variables: {
												id: task.id,
												is_prioritize: !task.is_prioritize,
											},
										});
									}}
								/>
								<FontAwesomeIcon
									icon={faSpinner}
									className={styles.pillButton}
									onClick={(e) => {
										e.stopPropagation();
										updateTaskStatus({
											variables: {
												id: task.id,
												status: 'In Progress',
											},
										});
									}}
								/>
								<FontAwesomeIcon
									icon={faCheckCircle}
									className={styles.pillButton}
									onClick={(e) => {
										e.stopPropagation();
										updateTaskStatus({
											variables: {
												id: task.id,
												status: 'Done',
											},
										});
									}}
								/>
							</div>
						</div>
					</Pill>
				);
			} else if (task.status === 'In Progress') {
				acc.inProgress.push(
					<Pill
						onClick={() => {
							setSelectedTask(task);
							setEditorState(() =>
								EditorState.createWithContent(convertFromRaw(JSON.parse(task.description)))
							);
							setIsUseDetail(true);
						}}
					>
						<div className={styles.pillContent}>
							<div className={styles.pillContentText}>
								<span className={styles.pillTitle}>{task.name}</span>
								<span
									className={
										getLateStatus(task.deadline) ? styles.pillCountdownLate : styles.pillCountdown
									}
								>
									{getCountdown(task.deadline)}
								</span>
							</div>
							<div className={styles.pillContentButton}>
								<FontAwesomeIcon
									icon={faStar}
									className={task.is_prioritize ? styles.pillStarSelected : styles.pillButton}
									onClick={(e) => {
										e.stopPropagation();
										updateTaskPriority({
											variables: {
												id: task.id,
												is_prioritize: !task.is_prioritize,
											},
										});
									}}
								/>
								<FontAwesomeIcon
									icon={faStickyNote}
									className={styles.pillButton}
									onClick={(e) => {
										e.stopPropagation();
										updateTaskStatus({
											variables: {
												id: task.id,
												status: 'To Do',
											},
										});
									}}
								/>
								<FontAwesomeIcon
									icon={faCheckCircle}
									className={styles.pillButton}
									onClick={(e) => {
										e.stopPropagation();
										updateTaskStatus({
											variables: {
												id: task.id,
												status: 'Done',
											},
										});
									}}
								/>
							</div>
						</div>
					</Pill>
				);
			} else if (task.status === 'Done') {
				acc.done.push(
					<Pill
						isDone
						onClick={() => {
							setSelectedTask(task);
							setEditorState(() =>
								EditorState.createWithContent(convertFromRaw(JSON.parse(task.description)))
							);
							setIsUseDetail(true);
						}}
					>
						<div className={styles.pillContent}>
							<div className={styles.pillContentText}>
								<span className={styles.pillTitleDone}>{task.name}</span>
								<span className={styles.pillCountdownDone}>Done</span>
							</div>
							<div className={styles.pillContentButton}>
								<FontAwesomeIcon
									icon={faStickyNote}
									className={styles.pillButton}
									onClick={(e) => {
										e.stopPropagation();
										updateTaskStatus({
											variables: {
												id: task.id,
												status: 'To Do',
											},
										});
									}}
								/>
								<FontAwesomeIcon
									icon={faSpinner}
									className={styles.pillButton}
									onClick={(e) => {
										e.stopPropagation();
										updateTaskStatus({
											variables: {
												id: task.id,
												status: 'In Progress',
											},
										});
									}}
								/>
							</div>
						</div>
					</Pill>
				);
			}
			return acc;
		},
		{
			toDo: [
				<Pill
					isCreate
					onClick={() => {
						navigate(`/list/${listId}/create`);
					}}
				></Pill>,
			],
			inProgress: [
				<Pill
					isCreate
					onClick={() => {
						navigate(`/list/${listId}/create`);
					}}
				></Pill>,
			],
			done: [],
		}
	);

	const handleImageShow = (data) => {
		const images = JSON.parse(data);
		if (images) {
			return images.map((image) => {
				return {
					url: image,
					title: selectedTask.name,
				};
			});
		}
	};

	if (loading) {
		return <LoopCircleLoading size="large" color="black" />;
	}

	return (
		<>
			<div
				className={classNames(
					styles.container,
					isUseDetail ? styles.slideInTable : styles.slideOutTable
				)}
			>
				<table className={styles.table}>
					<thead>
						<tr>
							<th className={styles.tableHeader}>To Do</th>
							<th className={styles.tableHeader}>In Progress</th>
							<th className={styles.tableHeader}>Done </th>
						</tr>
					</thead>
					<tbody>
						{findMaxLength(data).map((item, index) => {
							return (
								<tr className={styles.tableRow} key={index}>
									<td className={styles.tableData}>
										{data.toDo[index] ? data.toDo[index] : <></>}
									</td>
									<td className={styles.tableData}>
										{data.inProgress[index] ? data.inProgress[index] : <></>}
									</td>
									<td className={styles.tableData}>
										{data.done[index] ? data.done[index] : <></>}
									</td>
								</tr>
							);
						})}
					</tbody>
				</table>
			</div>
			<div
				className={classNames(styles.detailFixed, isUseDetail ? styles.slideIn : styles.slideOut)}
			>
				<div className={styles.detailContainer}>
					{selectedTask ? (
						<>
							<div className={styles.detailContent}>
								<div className={styles.detailTitle}>
									<span>{selectedTask.name}</span>
									<FontAwesomeIcon
										className={styles.sliderCloseIcon}
										icon={faClose}
										onClick={() => {
											setIsUseDetail(false);
										}}
									/>
								</div>
								<hr className={styles.detailDivider} />
								<div className={styles.detailDescription}>
									<div className={styles.detailPoint}>
										<span className={styles.label}>Status</span>
										<span className={styles.status}>{selectedTask.status}</span>
									</div>
									<div className={styles.detailPoint}>
										<span className={styles.label}>Due Date</span>
										<span className={styles.deadline}>
											{moment(selectedTask.deadline).format('DD MMM YYYY - HH:mm')}
										</span>
									</div>
									<div className={styles.detailPoint}>
										<span className={styles.label}>Image</span>
										{JSON.parse(selectedTask.image).length > 0 ? (
											<span
												className={styles.image}
												onClick={() => {
													setShowImageModal(true);
												}}
											>
												Show Image
											</span>
										) : (
											<span className={styles.noImage}>No Image</span>
										)}
									</div>
									<hr className={styles.detailDivider} />
									<div className={styles.description}>
										{editorState.getCurrentContent().hasText() ? (
											<Editor
												editorState={editorState}
												toolbar={{
													options: [],
												}}
												stripPastedStyles={true}
											/>
										) : (
											<span className={styles.noDescription}>No Description</span>
										)}
									</div>
								</div>
							</div>
							<div className={styles.detailAction}>
								<Button
									type="Secondary"
									className={styles.detailButton}
									clickFunction={() => {
										navigate(`/list/${listId}/${selectedTask.id}`);
									}}
								>
									<FontAwesomeIcon icon={faEdit} className={styles.actionIcon} />
									Edit
								</Button>
								<Button
									type="Danger"
									className={styles.detailButton}
									clickFunction={() => {
										setShowDeleteModal(true);
									}}
								>
									<FontAwesomeIcon icon={faTrash} className={styles.actionIcon} />
									Delete
								</Button>
							</div>
						</>
					) : (
						<>
							<div className={styles.noneContainer}>
								<div className={styles.closeTitle}>
									<FontAwesomeIcon
										className={styles.sliderCloseIcon}
										icon={faClose}
										onClick={() => {
											setIsUseDetail(false);
										}}
									/>
								</div>
								<div className={styles.noneContent}>
									<FontAwesomeIcon icon={faInfoCircle} className={styles.infoIcon} />
									<span className={styles.noneText}>No task selected</span>
								</div>
							</div>
						</>
					)}
				</div>
			</div>
			<div
				className={classNames(
					styles.sliderOpenIconContainer,
					isUseDetail ? styles.hideSliderOpenIcon : styles.showSliderOpenIcon
				)}
				onClick={() => {
					setIsUseDetail(true);
				}}
			>
				<FontAwesomeIcon
					className={classNames(
						styles.sliderOpenIcon,
						isUseDetail ? styles.hideSliderOpenIcon : styles.showSliderOpenIcon
					)}
					icon={faAngleDoubleLeft}
				/>
			</div>
			<Modal
				visible={showDeleteModal}
				height="20%"
				width="40%"
				onClickAway={() => setShowDeleteModal(false)}
			>
				<div className={styles.modal}>
					<div className={styles.modalContent}>
						<span>
							Are you sure you want to delete <strong>{selectedTask?.name}</strong>?
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
			{showImageModal && (
				<Lightbox
					images={handleImageShow(selectedTask?.image)}
					title={selectedTask?.name}
					onClose={() => {
						setShowImageModal(false);
					}}
				/>
			)}
			<ToastContainer />
		</>
	);
}
