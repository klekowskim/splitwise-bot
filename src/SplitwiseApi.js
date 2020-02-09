const _ = require("lodash");
const Splitwise = require("splitwise");

module.exports = function SplitwiseApi() {

	const api = Splitwise({
		consumerKey: process.env.SPLITWISE_CONSUMER_KEY,
		consumerSecret: process.env.SPLITWISE_CONSUMER_SECRET
	});
	const groupId = process.env.SPLITWISE_GROUP_ID;

	async function getGroupBalance() {
		const response = await api.getGroup({ id: groupId });

		return response.members.map(m => {
			let amount = 0;
			if (m.balance[0]) {
				amount = parseFloat(m.balance[0].amount);
				console.log(">>amount", m.balance[0].amount, amount);
			}
			return ({
				id: m.id,
				name: `${m.first_name} ${m.last_name}`, // todo remove?
				amount
			});
		});
	}

	return {
		getGroupBalance
	}

};
