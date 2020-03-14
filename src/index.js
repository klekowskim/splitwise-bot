const dotenv = require("dotenv");
dotenv.config();
const splitwiseUserToSlackMapping = require(process.env.USERS_MAPPING_FILE);

const Splitwise = require("splitwise");
const splitwise = Splitwise({
	consumerKey: process.env.SPLITWISE_CONSUMER_KEY,
	consumerSecret: process.env.SPLITWISE_CONSUMER_SECRET
});
const groupId = process.env.SPLITWISE_GROUP_ID;

const SplitwiseApi = require("./SplitwiseApi");
const SlackBot = require("./SlackBot");
const UsersMapper = require("./usersMapper");

const slackBot = SlackBot(SplitwiseApi(splitwise, groupId), UsersMapper(splitwiseUserToSlackMapping));
slackBot.start();
