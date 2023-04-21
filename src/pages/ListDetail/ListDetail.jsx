import React, { useState } from 'react';
import styles from './ListDetail.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
	faAngleDoubleLeft,
	faClose,
	faEdit,
	faInfoCircle,
	faTrash,
} from '@fortawesome/free-solid-svg-icons';
import { TASK } from '../../constant';
import moment from 'moment';
import { Pill, Button } from '../../components';
import { findMaxLength } from '../../utilities/find_max_length';
import classNames from 'classnames/bind';

export default function ListDetail() {
	const [selectedTask, setSelectedTask] = useState();
	const [isUseDetail, setIsUseDetail] = useState(false);
	console.log(selectedTask);

	const data = TASK.reduce(
		(acc, task) => {
			if (task.status === 'To Do') {
				acc.toDo.push(
					<Pill
						onClick={() => {
							setSelectedTask(task);
							setIsUseDetail(true);
						}}
					>
						{task.name}
					</Pill>
				);
			} else if (task.status === 'In Progress') {
				acc.inProgress.push(
					<Pill
						onClick={() => {
							setSelectedTask(task);
							setIsUseDetail(true);
						}}
					>
						{task.name}
					</Pill>
				);
			} else if (task.status === 'Done') {
				acc.done.push(
					<Pill
						isDone
						onClick={() => {
							setSelectedTask(task);
							setIsUseDetail(true);
						}}
					>
						{task.name}
					</Pill>
				);
			}
			return acc;
		},
		{
			toDo: [<Pill isCreate></Pill>],
			inProgress: [<Pill isCreate></Pill>],
			done: [<Pill isCreate></Pill>],
		}
	);

	const dataMax = findMaxLength(data);
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
						{dataMax.map((item, index) => {
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
											{moment(selectedTask.deadline).toLocaleString()}
										</span>
									</div>
									<div className={styles.detailPoint}>
										<span className={styles.label}>Image</span>
										<span className={styles.image}>{selectedTask.image}</span>
									</div>
									<hr className={styles.detailDivider} />
									<div className={styles.description}>{selectedTask.description}</div>
								</div>
							</div>
							<div className={styles.detailAction}>
								<div className={styles.editContainer}>
									<FontAwesomeIcon icon={faEdit} className={styles.actionIcon} />
									<span>Edit</span>
								</div>
								<div className={styles.deleteContainer}>
									<FontAwesomeIcon icon={faTrash} className={styles.actionIcon} />
									<span>Delete</span>
								</div>
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
		</>
	);
}
