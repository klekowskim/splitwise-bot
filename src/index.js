const dotenv = require("dotenv");
dotenv.config();

const SplitwiseApi = require("./SplitwiseApi");
const SlackBot = require("./SlackBot");
const UsersMapper = require("./usersMapper");

const slackBot = SlackBot(SplitwiseApi(), UsersMapper());
slackBot.start();
