const mapBy = require("./utils/mapBy");

module.exports = function (webClient) {

	let CACHE = {};

	async function fetchUsersInfo(usersIds) {
		const requests = usersIds.reduce((acc, user) => {
			const request = webClient.users.info({
				user: user
			});
			acc.push(request);
			return acc;
		}, []);
		const responses = await Promise.all(requests);
		return responses
			.filter(resp => resp.ok === true)
			.map(resp => resp.user);
	}

	async function getUsersInfo(usersIds) {
		console.log("Get users info", usersIds);

		const { inCache, notInCache } = usersIds.reduce((acc, userId) => {
			if (CACHE[userId]) {
				acc.inCache.push(userId);
			} else {
				acc.notInCache.push(userId);
			}
			return acc;
		}, { inCache: [], notInCache: [] });

		console.log("Users found in cache", inCache);

		const fetchedUsers = await fetchUsersInfo(notInCache);
		const usersFromCache = inCache.map(userId => CACHE[userId]);

		CACHE = mapBy(fetchedUsers, "id", CACHE);

		return [...fetchedUsers, ...usersFromCache];
	}

	return {
		getUsersInfo
	}
};
