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

		let result = response.members.map(m => {
			let amount = 0;
			let currency = "?";
			if (m.balance[0]) {
				amount = parseFloat(m.balance[0].amount);
				currency = m.balance[0].currency_code;
			}
			return ({
				id: m.id,
				name: `${m.first_name} ${m.last_name}`,
				amount,
				currency
			});
		});

		return _.sortBy(result, "amount");
	}

	return {
		getGroupBalance
	}

};
