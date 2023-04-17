import moment from 'moment';

export const dateFromNow = (timestamp) => {
	const date = new Date(timestamp);
	const timeAgo = moment(date).fromNow();
	return timeAgo;
};
