"use strict";

/* App Configuration */

angular.module( "vokal", [
	"ngRoute",
	"ngTouch",
	"ngSanitize",
	"ngAnimate",
	"vokal.filters",
	"vokal.services",
	"vokal.directives",
	"vokal.controllers"
] )

.run( function ( $rootScope, $route, $location ) {

  $rootScope.$on('$locationChangeStart', function(ev, next, current) {

	if ( Modernizr.mq( "only screen and ( max-width: 768px )" ) && Modernizr.touch )
	{
		$location.path( "/app" );
	}

  });

})

.config( [ "$routeProvider", "$locationProvider", "$sceDelegateProvider",

	function ( $routeProvider, $locationProvider, $sceDelegateProvider )
	{
		$routeProvider.when( "/app", { templateUrl: STATIC_PATH + "templates/app.html", controller: "App" } );
		$routeProvider.when( "/", { templateUrl: STATIC_PATH + "templates/home.html", controller: "Home" } );
		$routeProvider.otherwise( { redirectTo: "/" } );

		$locationProvider.html5Mode( true ).hashPrefix( "!" );

		$sceDelegateProvider.resourceUrlWhitelist(
			[ "self", "http://*.s3.amazonaws.com/**", "https://*.s3.amazonaws.com/**" ]
		);

	}

] );
