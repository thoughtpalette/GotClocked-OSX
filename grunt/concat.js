module.exports = {
	scripts:
	{
		src: [
			"source/scripts/project/*"
		],
		dest: "build/project.js"
	},
	jquery:
	{
		src: [
			"source/components/jquery/dist/jquery.min.js",
			"source/scripts/library/jquery.cookie.js"
		],
		dest: "build/jquery.js"
	},
	timer:
	{
		src: [
			"source/scripts/library/timer.js"
		],
		dest: "build/timer.js"
	},
	countup:
	{
		src: [
			"source/scripts/library/countUp.js"
		],
		dest: "build/countup.js"
	},
	angular:
	{
		src: [
			"source/components/angular/angular.min.js",
			"source/components/angular-route/angular-route.min.js",
			"source/components/angular-touch/angular-touch.min.js",
			"source/components/angular-sanitize/angular-sanitize.min.js",
			"source/components/angular-animate/angular-animate.min.js"
		],
		dest: "build/angular.js"
	},
	bigVideo:
	{
		src: [
			"source/components/video.js/dist/video-js/video.js",
			"source/components/BigVideo.js/lib/bigvideo.js"
		],
		dest: "build/bigvideo.js"
	},
	moment:
	{
		src: [
			"source/components/moment/min/moment.min.js"
		],
		dest: "build/moment.js"
	},
	modernizr:
	{
		src: [
			"source/scripts/library/modernizr.custom.js"
		],
		dest: "build/modernizr.custom.js"
	},
	styles:
	{
		src: [
			"source/styles/library/reset.css",
			"source/styles/library/vokal.css",
			"source/components/BigVideo.js/css/bigvideo.css"
		],
		dest: "build/base.css"
	}
};