const _ = require("lodash");

module.exports = function (mapping) {
	const slackUserToSplitwiseMapping = _.invert(mapping);
	return {
		getSlackUser: function (splitwiseUserId) {
			return mapping[`${splitwiseUserId}`];
		},
		getSplitwiseUser: function (slackUserId) {
			return slackUserToSplitwiseMapping[slackUserId]
		}
	};
};
