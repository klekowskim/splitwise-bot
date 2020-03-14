const SlackBotAppMentionHandler = require("./SlackBotAppMentionHandler");
const UsersMapper = require("./usersMapper");
const testData = require("./testData");
const messageTemplates = require("./templates");

const CHANNEL = "C1230SA";
const SLACK_USER_1 = "U0ABCDEF1";
const SLACK_USER_2 = "U0ABCDEF2";
const SLACK_USER_3 = "U0ABCDEF3";
const SLACK_USER_4 = "U0ABCDEF4";
const SLACK_USER_5 = "U0ABCDEF5";
const SLACK_USER_6 = "U0ABCDEF6";
const SLACK_USER_7 = "U0ABCDEF7";
const SLACK_USER_1_DETAILS = testData.slack.createUser(SLACK_USER_1, "Jan Kowalski");
const SLACK_USER_2_DETAILS = testData.slack.createUser(SLACK_USER_2, "Kszystof Jarzyna ze Szczecina");
const SLACK_USER_3_DETAILS = testData.slack.createUser(SLACK_USER_3, "Chytra baba z Radomia");
const SLACK_USER_4_DETAILS = testData.slack.createUser(SLACK_USER_4, "Mateusz");
const SLACK_USER_5_DETAILS = testData.slack.createUser(SLACK_USER_5, "Kamil");
const SLACK_USER_6_DETAILS = testData.slack.createUser(SLACK_USER_6, "Tomek");
const SLACK_USER_7_DETAILS = testData.slack.createUser(SLACK_USER_7, "Krystian");
const SLACK_USERS = [SLACK_USER_1_DETAILS, SLACK_USER_2_DETAILS, SLACK_USER_3_DETAILS, SLACK_USER_4_DETAILS, SLACK_USER_5_DETAILS,
	SLACK_USER_6_DETAILS, SLACK_USER_7_DETAILS];
const mapping = {
	1: SLACK_USER_1, 2: SLACK_USER_2, 3: SLACK_USER_3, 4: SLACK_USER_4, 5: SLACK_USER_5, 6: SLACK_USER_6, 7: SLACK_USER_7
};

describe("SlackBotAppMentionHandler", () => {

	let handler;
	let splitwiseApiMock;
	let slackWebClientMock;

	beforeEach(() => {
		splitwiseApiMock = {
			getGroupBalance: jest.fn()
		};
		slackWebClientMock = {
			chat: {
				postMessage: jest.fn()
			},
			conversations: {
				replies: jest.fn()
			},
			users: {
				info: jest.fn()
			}
		};

		handler = new SlackBotAppMentionHandler(slackWebClientMock, splitwiseApiMock, UsersMapper(mapping))
	});

	describe("handle ask for help", () => {
		[undefined, "T123012"].forEach(threadTs => {
			it(`should replay help${threadTs ? " in thread" : ""}`, async () => {
				// given
				const slackEvent = testData.slack.createAppMention(CHANNEL, threadTs, "<BOT_ID> help");

				// when
				await handler.handle(slackEvent);

				// then
				assertReplayBlocks(CHANNEL, threadTs, messageTemplates.helpBlocks())
			});
		});
	});

	describe("handle ask for balance", () => {
		[undefined, "T123012"].forEach(threadTs => {
			it("should replay balance", async () => {
				// given
				const balance = [
					{ id: 1, name: "Jan Kowalski", amount: -12.31, currency: "PLN" },
					{ id: 2, name: "Kszystof Jarzyna ze Szczecina", amount: -10, currency: "PLN" },
					{ id: 2, name: "Chytra baba z Radomia", amount: -10, currency: "PLN" },
				];
				splitwiseApiMock.getGroupBalance.mockResolvedValue(balance);
				const slackEvent = testData.slack.createAppMention(CHANNEL, threadTs, "<BOT_ID> balance");

				// when
				await handler.handle(slackEvent);

				// then
				assertReplayBlocks(CHANNEL, threadTs, messageTemplates.totalBalance(balance))
			});
		});
	});

	describe("handle ask in thread without message", () => {

		const balance = [
			{ id: 1, name: "Jan Kowalski", amount: -12.31, currency: "PLN" },
			{ id: 2, name: "Kszystof Jarzyna ze Szczecina", amount: -10, currency: "PLN" },
			{ id: 3, name: "Chytra baba z Radomia", amount: 21, currency: "PLN" },
			{ id: 4, name: "Mateusz", amount: 13.50, currency: "PLN" },
			{ id: 5, name: "Kamil", amount: -99.99, currency: "PLN" },
			{ id: 6, name: "Tomek", amount: -125, currency: "PLN" },
			{ id: 7, name: "Krystian", amount: 111.23, currency: "PLN" },
		];

		it("should replay with 3 users from thread with highest debt", async () => {
			// given
			const threadTs = "T123012";
			splitwiseApiMock.getGroupBalance.mockResolvedValue(balance);
			const slackEvent = testData.slack.createAppMention(CHANNEL, threadTs, "<BOT_ID>");
			slackWebClientMock.conversations.replies.mockResolvedValue({
				messages: [
					testData.slack.createThreadMessage(SLACK_USER_1, "lunch vege - naan"),
					testData.slack.createThreadMessage(SLACK_USER_2, "lunch mięso - ryż"),
					testData.slack.createThreadMessage(SLACK_USER_3, "lunch vege - naan"),
					testData.slack.createThreadMessage(SLACK_USER_4, "lunch vege - ryż"),
					testData.slack.createThreadMessage(SLACK_USER_5, "lunch vege - naan"),
				]
			});
			slackWebClientMock.users.info
				.mockImplementation(({ user }) => Promise.resolve({ ok: true, user: SLACK_USERS.find(u => u.id === user) }));

			// when
			await handler.handle(slackEvent);

			// then
			assertReplayBlocks(CHANNEL, threadTs, messageTemplates.topUserWithBalance([
				{ slackUser: SLACK_USER_5_DETAILS, balance: balance[4] },
				{ slackUser: SLACK_USER_1_DETAILS, balance: balance[0] },
				{ slackUser: SLACK_USER_2_DETAILS, balance: balance[1] },
			]))
		});

	});

	function assertReplay(channel, threadTs, message) {
		expect(slackWebClientMock.chat.postMessage).toHaveBeenCalledTimes(1);
		expect(slackWebClientMock.chat.postMessage).toHaveBeenCalledWith({
			channel: channel,
			thread_ts: threadTs,
			text: message,
			message: message
		});
	}

	function assertReplayBlocks(channel, threadTs, blocks) {
		expect(slackWebClientMock.chat.postMessage).toHaveBeenCalledTimes(1);
		expect(slackWebClientMock.chat.postMessage).toHaveBeenCalledWith({
			channel: channel,
			thread_ts: threadTs,
			blocks: blocks
		});
	}
});
