# Splitwise bot

This is a slack bot that check in the splitwise who should order the meal from the lunch train.

## Usage

Communication with bot is by asking it. Let's assume that you named the bot `Who orders`, then you can do:

- Display help: `@Who orders help`
- Check who should order the food (in THREAD): `@Who orders`
- Display group balance: `@Who orders balance`

## Preparing Slack bot

// TBD

### Permissions

Bot requires the following permissions:
- `app_mentions:read`
- `chat:write`
- `groups:history`
- `groups:write`
- `groups:read`
- `users:read`

## Registering Splitwise app

// TBD

## How to run

1. Run `npm ci`.
1. Create `usersMapping.json` file. This must be valid json file with the following format: 
    ```
    { 
        "<splitwise user id>": "<slack user id>",
        "<splitwise user id>": "<slack user id>"
    }
    ```
1. Run command with filled params: `node index.js [params]` where params are:
- `--BOT_TOKEN`: Bot token generated in slack `* required`
- `--SLACK_SIGNING_SECRET`: Slack secret generated in slack `* required` 
- `--SPLITWISE_CONSUMER_KEY`: Splitwise key (see: Registering Splitwise app) `* required`
- `--SPLITWISE_CONSUMER_SECRET`: Splitwise secret (see: Registering Splitwise app) `* required`
- `--SPLITWISE_GROUP_ID`: Splitwise group to check balance `* required`
- `--USERS_MAPPING_FILE`: Path to user mapping file (relative to index.js) `* required`
- `--port`
