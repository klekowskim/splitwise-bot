function createAppMention(channel, threadTs, text) {
	return {
		client_msg_id: 'a6fd3c51-80cc-49fd-9a83-ad862be1d3dc',
		type: 'app_mention',
		text: text,
		user: 'U634GTGEP',
		ts: '0000000001.000001',
		team: 'T000AAA00',
		blocks: [],
		thread_ts: threadTs,
		parent_user_id: 'U634GTGEP',
		channel: channel,
		event_ts: '0000000000.000000'
	};
}

function createThreadMessage(user, text) {
	return {
		client_msg_id: 'a8f781dc-28b4-4b64-9e53-b779b11765d7',
		type: 'message',
		text: text,
		user: user,
		ts: '1583480435.084300',
		team: 'T024FAU14',
		blocks: [],
		thread_ts: '0000000000.000001'
	}
}

function createThreadBotMessage(botId, user, text) {
	return {
		client_msg_id: 'a8f781dc-28b4-4b64-9e53-b779b11765d7',
		type: 'message',
		text: text,
		user: user,
		bot_id: botId,
		ts: '1583480435.084300',
		team: 'T024FAU14',
		blocks: [],
		thread_ts: '0000000000.000001'
	}
}

function createUser(id, name) {
	return {
		id: id,
		team_id: "T000AB000",
		name: name,
		deleted: false,
		color: "9f69e7",
		real_name: name,
		tz: "America/New_York",
		tz_label: "Eastern Daylight Time",
		tz_offset: -14400,
		profile: {},
		is_admin: false,
		is_owner: false,
		is_primary_owner: false,
		is_restricted: false,
		is_ultra_restricted: false,
		is_bot: false,
		is_stranger: false,
		updated: 1502138686,
		is_app_user: false,
		is_invited_user: false,
		has_2fa: false,
		locale: "en-US"
	}
}

function groupResponseBuilder() {
	const response = {
		id: 1231231,
		name: "a test group",
		updated_at: "2017-08-30T20:31:51Z",
		members: [],
		simplify_by_default: true,
		original_debts: [],
		simplified_debts: [],
		whiteboard: "a message!",
		group_type: "apartment",
		invite_link: "https://www.splitwise.com/join/abcdef1232456"
	};

	const builder = {
		withId: function (id) {
			response.id = id;
			return builder;
		},
		withMember: function (member) {
			response.members.push(member);
			return builder;
		},
		build: function () {
			return response;
		}
	};
	return builder;
}

function createMember(id, amountString, currencyCode = "PLN") {
	return {
		id: id,
		first_name: "First name",
		last_name: "Last name",
		picture: {
			"small": "image_url",
			"medium": "image_url",
			"large": "image_url"
		},
		email: "test@test-email.pl",
		registration_status: "confirmed",
		balance: [
			{
				currency_code: currencyCode,
				amount: amountString
			}
		]
	}
}

module.exports = {
	slack: {
		createAppMention,
		createThreadMessage,
		createUser
	},
	splitwise: {
		groupResponseBuilder,
		createMember
	}
};
