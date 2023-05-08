import moment from 'moment';

export const dateFromNow = (timestamp) => {
	const date = new Date(timestamp);
	const timeAgo = moment(date).fromNow();
	return timeAgo;
};

export const getCountdown = (deadline) => {
	const now = moment();
	const targetDate = moment(deadline);

	let countdownText = '';

	if (now.isAfter(targetDate)) {
		const duration = moment.duration(now.diff(targetDate));
		const days = duration.days();
		const hours = duration.hours();
		const minutes = duration.minutes();

		if (days > 0) {
			countdownText = `${days} day${days > 1 ? 's' : ''} late`;
		} else if (hours > 0) {
			countdownText = `${hours} hour${hours > 1 ? 's' : ''} late`;
		} else {
			countdownText = `${minutes} minute${minutes > 1 ? 's' : ''} late`;
		}
	} else {
		const duration = moment.duration(targetDate.diff(now));
		const days = duration.days();
		const hours = duration.hours();
		const minutes = duration.minutes();

		if (days > 0) {
			countdownText = `${days} day${days > 1 ? 's' : ''} left`;
		} else if (hours > 0) {
			countdownText = `${hours} hour${hours > 1 ? 's' : ''} left`;
		} else {
			countdownText = `${minutes} minute${minutes > 1 ? 's' : ''} left`;
		}
	}

	return countdownText;
};

export const getLateStatus = (deadline) => {
	const now = moment();
	const targetDate = moment(deadline);

	return now.isAfter(targetDate);
};
