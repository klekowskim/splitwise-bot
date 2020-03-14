const SlackBotAppMentionHandler = require("./SlackBotAppMentionHandler");
const { createEventAdapter } = require("@slack/events-api");
const { WebClient } = require("@slack/web-api");

module.exports = function SlackBot(splitwiseApi, usersMapper) {
	const slackEventsAdapter = createEventAdapter(process.env.SLACK_SIGNING_SECRET);
	const port = process.env.PORT || 3000;
	const webClient = new WebClient(process.env.BOT_TOKEN);
	const appMentionHandler = SlackBotAppMentionHandler(webClient, splitwiseApi, usersMapper);

	const onAppMention = (event) => {
		console.log(`App mention`, event);
		appMentionHandler.handle(event);
	};

	const onError = console.error;

	const start = () => {
		slackEventsAdapter.on("app_mention", onAppMention);
		slackEventsAdapter.on("error", onError);
		slackEventsAdapter
			.start(port)
			.then(() => {
				console.log(`Server listening on port ${port}`);
			});
	};

	return {
		start
	}
};
