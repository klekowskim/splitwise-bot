const _ = require("lodash");
const splitwiseUserToSlackMapping = require(process.env.USERS_MAPPING_FILE);

module.exports = function () {
	const slackUserToSplitwiseMapping = _.invert(splitwiseUserToSlackMapping);
	return {
		getSlackUser: function (splitwiseUserId) {
			return splitwiseUserToSlackMapping[`${splitwiseUserId}`];
		},
		getSplitwiseUser: function (slackUserId) {
			return slackUserToSplitwiseMapping[slackUserId]
		}
	};
};
