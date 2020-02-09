
function helpBlocks() { // TODO add help blocks instead of this example
	return [
		{
			type: "divider"
		},
		{
			type: "section",
			text: {
				type: "mrkdwn",
				text:
					"*Farmhouse Thai Cuisine*\n:star::star::star::star: 1528 reviews\n They do have some vegan options, like the roti and curry, plus they have a ton of salad stuff and noodles can be ordered without meat!! They have something for everyone here"
			},
			accessory: {
				type: "image",
				image_url:
					"https://s3-media3.fl.yelpcdn.com/bphoto/c7ed05m9lC2EmA3Aruue7A/o.jpg",
				alt_text: "alt text for image"
			}
		}
	]
}

module.exports = {
	helpBlocks
};
