module.exports = {
	options:
	{
		mangle: true,
		compress: true,
		banner: "/*! <%= pkg.name %> <%= grunt.template.today( 'yyyy-mm-dd' ) %> */",
		sourceMap: true,
		sourceMapName: "build/project.js.map"
	},
	project:
	{
		files:
		{
			"build/project.js": [
				"source/scripts/project/*"
			]
		}
	}
};