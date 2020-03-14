const _ = require("lodash");

module.exports = function SplitwiseApi(api, groupId) {

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
