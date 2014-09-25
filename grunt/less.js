module.exports = {
	dev:
	{
		files: {
			"build/project.css": "source/styles/project/main.less"
		}
	},
	deploy:
	{
		options: {
			rootpath: process.env.STATIC_PATH || ""
		},
		files: {
			"build/project.css": "source/styles/project/main.less"
		}
	}
};