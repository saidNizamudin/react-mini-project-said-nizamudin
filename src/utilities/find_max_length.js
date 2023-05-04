export const findMaxLength = (object) => {
	let max = [];
	for (let key in object) {
		if (object[key].length > max.length) {
			max = object[key];
		}
	}
	return max;
};
