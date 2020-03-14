const _ = require("lodash");
const messageTemplates = require("./templates");

function isAskForHelp(event) {
	return event.text.indexOf("help") > -1;
}

function isAskForBalance(event) {
	return event.text.indexOf("balance") > -1;
}

function isInThread(event) {
	return !!event.thread_ts;
}

module.exports = function (webClient, splitwiseApi, usersMapper) {

	async function reply(conversationId, threadTs, message) {
		return webClient.chat.postMessage({
			channel: conversationId,
			thread_ts: threadTs,
			text: message,
			message: message
		});
	}

	async function replyBlocks(conversationId, threadTs, blocks) {
		return await webClient.chat.postMessage({
			channel: conversationId,
			thread_ts: threadTs,
			blocks: blocks
		});
	}

	async function getUsersIdsFromThread(channel, threadTs) {
		console.log("Get messages from thread. Channel: %s. Thread: %s.", channel, threadTs);
		const response = await webClient.conversations.replies({
			channel: channel,
			ts: threadTs
		});

		console.log("Messages in thread: ", response.messages);

		let userIds = response.messages.reduce((acc, message) => {
			if (message.hasOwnProperty("user") && !message.hasOwnProperty("bot_id")) {
				return [...acc, message.user];
			}
			return acc;
		}, []);
		return _.uniq(userIds);
	}

	async function getUsersInfo(usersIds) {
		// todo add cache
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

	function findUsersWithTopDebt(slackUsers, balance, count) {
		// todo validate user not found
		const usersWithBalance = slackUsers.reduce((acc, slackUser) => {
			const splitwiseUserId = usersMapper.getSplitwiseUser(slackUser.id);
			if (splitwiseUserId) {
				const userBalance = balance.find(b => `${b.id}` === splitwiseUserId);
				// todo validate found
				return [...acc, { slackUser, balance: userBalance }];
			}
			return acc;
		}, []);

		return _.take(_.orderBy(usersWithBalance, "balance.amount"), count);
	}

	const handle = async (event) => {
		if (isAskForHelp(event)) {
			await replyBlocks(event.channel, event.thread_ts, messageTemplates.helpBlocks());
		} else if (isAskForBalance(event)) {
			const balance = await splitwiseApi.getGroupBalance();
			await replyBlocks(event.channel, event.thread_ts, messageTemplates.totalBalance(balance));
		} else if (isInThread(event)) {
			try {
				const usersIds = await getUsersIdsFromThread(
					event.channel,
					event.thread_ts
				);

				console.log("Users read from the thread", usersIds.join(", "));

				const slackUsers = await getUsersInfo(usersIds);

				console.log("Slack users details fetched");

				const balance = await splitwiseApi.getGroupBalance();
				const usersWithBalance = findUsersWithTopDebt(slackUsers, balance, 3);
				await replyBlocks(event.channel, event.thread_ts, messageTemplates.topUserWithBalance(usersWithBalance))
			} catch (e) {
				console.error(e);
				await reply(event.channel, event.thread_ts, "Something went wrong :disappointed:");
			}
		} else {
			await reply(event.channel, undefined, "Please ask me in thread.");
		}
	};

	return {
		handle
	}
};
