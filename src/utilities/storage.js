const storage = {
	get: (key, _default) => {
		try {
			const data = JSON.parse(sessionStorage.getItem(key));
			if (data === null) {
				return _default || undefined;
			}
			return data;
		} catch (error) {
			return _default || undefined;
		}
	},
	set: (key, value) => {
		sessionStorage.setItem(key, JSON.stringify(value));
		return sessionStorage.getItem(key);
	},
	remove: (key) => {
		sessionStorage.removeItem(key);
	},
	clear: () => {
		sessionStorage.clear();
	},
};

export default storage;
