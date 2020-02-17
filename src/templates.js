function divider() {
	return {
		"type": "divider"
	};
}

function helpBlocks() {
	return [
		{
			"type": "section",
			"text": {
				"type": "mrkdwn",
				"text": `Hi, I can check for you who should order the food. But not only this. Look what I can do:`
			}
		},
		divider(),
		{
			"type": "section",
			"text": {
				"type": "mrkdwn",
				"text": "*:one: Ask me for help* `@Who orders help`\nI'll try to help you by displaing this message."
			}
		},
		{
			"type": "section",
			"text": {
				"type": "mrkdwn",
				"text": "*:two: Mention me in the thread* `@Who orders`\nI'll check, who sent messages in the thread, then I'll display you top 3 (max) users with highest debt based on Splitwise amount."
			}
		},
		{
			"type": "section",
			"text": {
				"type": "mrkdwn",
				"text": "*:three: Ask me for balance* `@Who orders balance`\nI'll display the balance from Splitwise (ordered :scream:)."
			}
		}
	]
}

function usersBalanceHeader(numberOfUsers) {
	return {
		"type": "section",
		"text": {
			"type": "mrkdwn",
			"text": `Hi, I've check current balance and here are the top ${numberOfUsers} users from this thread:`
		}
	};
}

function userBalanceSection(number, user, call = false) {
	const userName = call ? `<@${user.slackUser.id}>` : user.slackUser.real_name;
	return {
		"type": "section",
		"text": {
			"type": "mrkdwn",
			"text": `${number}. ${userName}. *${user.balance.amount}*`
		}
	}
}

function topUserWithBalance(users) {
	const blocks = [usersBalanceHeader(users.length)];

	users.forEach((user, idx) => {
		blocks.push(userBalanceSection(idx + 1, user, idx === 0));
	});

	return blocks;
}

function balanceSection(number, balance) {
	return {
		"type": "section",
		"text": {
			"type": "mrkdwn",
			"text": `${number}. ${balance.name}. *${balance.amount}*`
		}
	}
}

function totalBalance(balance) {
	const blocks = [];

	balance.forEach((entry, idx) => {
		blocks.push(balanceSection(idx + 1, entry));
	});

	return blocks;
}

module.exports = {
	helpBlocks,
	topUserWithBalance,
	totalBalance,
};
