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
		$routeProvider.when( "/", { templateUrl: "templates/app.html", controller: "App" } );

		$sceDelegateProvider.resourceUrlWhitelist(
			[ "self", "http://*.s3.amazonaws.com/**", "https://*.s3.amazonaws.com/**" ]
		);

	}

] );

"use strict";

/* Controllers */

angular.module( "vokal.controllers", [] )


.controller( "Site", [ "$scope",

	function ( $scope )
	{
		$scope.name = "Site";
	}

] )

.controller( "Home", [ "$scope", "$timeout",

    function ( $scope, $timeout )
    {

        $(function() {
            var BV = new $.BigVideo();
            BV.init();
            BV.show( "build/got-clocked-scaled.mp4",{ambient:true});
        });

        $timeout( function () {
            $('.overlay').fadeOut();
        }, 3000 );

    }

] )


.controller( "App", [ "$scope", "$interval", "$timeout", "EmailService",

	function ( $scope, $interval, $timeout, EmailService )
	{
        var count;
        $scope.totalRate = 0;
        $scope.entries = [];
        $scope.meetingStarted = false;
        $scope.everySecond = 0;
        $scope.emailClicked = false;
        $scope.elapsedTime = null;
        $scope.moneySpent = null;
        $scope.emailSent = false;
        $scope.timedMessage = null;

        $scope.addRate = function ( rate ) {
            $scope.entry = {
                rate: rate
            };

            if ( rate !== null && rate !== undefined ) {
                $scope.entries.push($scope.entry);
                $scope.totalRate = $scope.totalRate + parseInt(rate);
            }

            $scope.rate = null;
        };

        $scope.removeRate = function ( rate ) {

            $scope.totalRate = $scope.totalRate - parseInt(rate.rate);

            $.each($scope.entries, function(i){
                if($scope.entries[i] === rate) {
                    $scope.entries.splice(i,1);
                    return false;
                }
            });

        };

        $scope.moneyTalks = function () {

            $interval( function () {
                var dollarString = angular.element( "#count-container" ).text(),
                    dollarString = dollarString.replace(/\$/g, ''),
                    dollarNum = parseFloat( dollarString.replace( ",", "" ).replace( " ","" ) );

                    if ( dollarNum > 140 && dollarNum < 499 )
                    {
                        $scope.timedMessage = "Buy 10 cases of Natty Ice or do that meeting again. Costs the same.";
                    }
                    else if ( dollarNum > 500 && dollarNum < 848 )
                    {
                        $scope.timedMessage = "Hey Daddy, you just spent 100 Big Macs on that!";
                    }
                    else if ( dollarNum > 849 && dollarNum < 999 )
                    {
                        $scope.timedMessage = "You could have bought an unlocked, 128gb iPhone 6 by now";
                    }
                    else if ( dollarNum > 1000 && dollarNum < 1749 )
                    {
                        $scope.timedMessage = "Cluck Cluck, that meeting could have been 1000 McChicken Sammiches";
                    }
                    else if ( dollarNum > 1750 && dollarNum < 2199 )
                    {
                        $scope.timedMessage = "You could have installed 25 above ground pools";
                    }
                    else if ( dollarNum > 2200 && dollarNum < 2999 )
                    {
                        $scope.timedMessage = "Hey, that was a great comment just now. ";
                    }
                    else if ( dollarNum > 3000 && dollarNum < 3639 )
                    {
                        $scope.timedMessage = "If that meeting went any longer, you could've hired a friend for the evening.";
                    }
                    else if ( dollarNum > 3640 && dollarNum < 4499 )
                    {
                        $scope.timedMessage = "Flowers.com could've delivered a dozen roses to your mother every week for a year";
                    }
                    else if ( dollarNum > 4500 && dollarNum < 8999 )
                    {
                        $scope.timedMessage = "You could have bought 1/4 ton of tilapia";
                    }
                    else if ( dollarNum > 9000 && dollarNum < 19999 )
                    {
                        $scope.timedMessage = "When the McRib comes back, you could have gotten 3000 for the cost of this meetin'";
                    }
                    else if ( dollarNum > 20000 && dollarNum < 38890 )
                    {
                        $scope.timedMessage = "You could have hired Snooky to party with your friends";
                    }
                    else if ( dollarNum > 38891 && dollarNum < 99999 )
                    {
                        $scope.timedMessage = "You could have paid for a year of full tuition at Harvard";
                    }
                    else if ( dollarNum > 100000 && dollarNum < 249999 )
                    {
                        $scope.timedMessage = "You could have had Simon Cowell go to your company picnic";
                    }
                    else if ( dollarNum > 250000 && dollarNum < 399999 )
                    {
                        $scope.timedMessage = "A Virgin Galactic ticket.. to space. You could be in space. You, space. ";
                    }
                    else if ( dollarNum > 400000 && dollarNum < 599999 )
                    {
                        $scope.timedMessage = "You better have cured cancer by now";
                    }
                    else if ( dollarNum > 600000 )
                    {
                        $scope.timedMessage = "Get Clocked again";
                    }


            }, 10000);
        };

        // countUp.js configuration
        // http://inorganik.github.io/countUp.js/
        var options = {
            useEasing : false,
            useGrouping : true,
            separator : ",",
            decimal : ".",
            prefix : "$"
        };

        $scope.startMeeting = function () {

            // Multiply rate by four to account for 4 hours (14400ms)
            count = new countUp( "count-container", 0, $scope.totalRate * 4, 2, 14400, options );
            count.start();
            $('#elapsed-time').runner({
                autostart: true,
                milliseconds: true
            });
            $scope.meetingStarted = true;
            $scope.moneyTalks();
        };

        $scope.stopMeeting = function () {
            count.stop();
            $( "#elapsed-time" ).runner( "stop" );
            $scope.elapsedTime = angular.element( "#elapsed-time" ).text();
            $scope.moneySpent = angular.element( "#count-container" ).text();
            $scope.stopped = true;
            $scope.emailClicked = false;
        };

        $scope.resumeMeeting = function () {
            count.resume();
            $( "#elapsed-time" ).runner( "start" );
            $scope.stopped = false;
            $scope.emailClicked = false;
        };

        $scope.resetMeeting = function () {
            // Need to stop before reset due to plugin constraints
            $( "#elapsed-time" ).runner( "stop" );
            $( "#elapsed-time" ).runner( "reset" );
            $scope.meetingStarted = false;
            $scope.stopped = false;
            $scope.entries = [];
            $scope.totalRate = 0;
            $scope.emailClicked = false;
            $scope.emailSent = false;
            $scope.timedMessage = null;
            count.reset();
        };

        $scope.showEmailForm = function () {
            $scope.emailClicked = true;

            $timeout( function () {
                angular.element( "#email" ).trigger( "focus" );
            }, 10);
        };

        $scope.sendEmail = function ( emailAddress ) {
            var dollarString = angular.element( "#count-container" ).text(),
                dollarString = dollarString.replace(/\$/g, ''),
                dollarNum = parseFloat( dollarString.replace( ",", "" ).replace( " ","" ) ),
                moneySpentString = $scope.moneySpent.replace(/\$/g, ''),
                totalMoneySpent = parseFloat( moneySpentString.replace( ",", "" ).replace( " ","" ) ),
                groupAverage = parseInt($scope.totalRate / $scope.entries.length, 10);

            EmailService.send(
            {
                email: emailAddress,
                spent: totalMoneySpent,
                time: $scope.elapsedTime,
                timeSent: moment().format('ddd MMM D, YYYY @ h:mma'),
                participants: $scope.entries.length,
                groupAvg: groupAverage,
                perHrCost: $scope.totalRate
            });

            $scope.email = null;
        };

        $scope.$on( "emailSuccess", function () {
            $scope.emailSent = true;
        });

	}

] );

"use strict";

/* Directives */

angular.module( "vokal.directives", [] )


// Make a container always fill the full height of the screen
.directive( "vokalFillheight", [ "$window",

	function ( $window )
	{
		return {
			restrict: "A",
			link: function ( scope, element, attrs )
			{
				var resize = function ()
				{
					var windowHeight = $( $window ).height();
					element.css( attrs.vokalFillheight === "fixed" ? "height" : "min-height", windowHeight + "px" );
				};

				$( $window ).on( "resize", resize );
				resize();
			}
		};
	}

] )


// Attach a date picker to a text input field
.directive( "vokalDatepicker", [ "$compile", "$filter",

	function ( $compile, $filter )
	{
		// Usage: <input type="text" x-ng-model="modelName" x-vokal-datepicker="modelName">

		return {
			restrict: "A",
			scope: { dateValue: "=vokalDatepicker" },
			require: "ngModel",
			link: function ( scope, element, attrs, ngModelController )
			{
				// Convert data from view to model format and validate
				ngModelController.$parsers.unshift( function( data )
				{
					var dateData = new Date( data );

					ngModelController.$setValidity( "date", !isNaN( dateData.getTime() ) );

					return dateData;
				} );

				// Convert data from model to view format and validate
				ngModelController.$formatters.unshift( function( data )
				{
					if( data )
					{
						ngModelController.$setValidity( "date", !isNaN( data.getTime() ) );
					}

					return data ? $filter( "date" )( data, "M/d/yyyy" ) : "";
				} );

				// Initialize
				scope.showDatepicker = false;
				var dateNow    = new Date();
				scope.dayNow   = dateNow.getDate();
				scope.monthNow = dateNow.getMonth() + 1;
				scope.yearNow  = dateNow.getFullYear();
				scope.dayNames = [ "Su", "Mo", "Tu", "We", "Th", "Fr", "Sa" ];

				// Build a month of days based on the date passed in
				scope.buildMonth = function ( year, month )
				{
					scope.days      = [];
					scope.filler    = [];
					scope.year      = year;
					scope.month     = month;
					scope.monthName = $filter( "date" )(
						year + "-" + ( month < 10 ? "0" : "" ) + month + "-01", "MMMM"
					);

					scope.prevYear  = month - 1 < 1  ? year - 1 : year;
					scope.nextYear  = month + 1 > 12 ? year + 1 : year;
					scope.prevMonth = month - 1 < 1  ? 12       : month - 1;
					scope.nextMonth = month + 1 > 12 ? 1        : month + 1;

					var daysInMonth = 32 - new Date( year, month - 1, 32 ).getDate();
					var firstDay    = new Date( year, month - 1, 1 ).getDay();

					for( var i = 1; i <= daysInMonth; i++ ) { scope.days.push( i ); }
					for( var k = 0; k < firstDay; k++ ) { scope.filler.push( k ); }
				};

				// Function to put selected date in the scope
				scope.applyDate = function ( selectedDate )
				{
					scope.dateValue = new Date( selectedDate );
					scope.showDatepicker = false;
				};

				// Build picker template and register with the directive scope
				var template = angular.element(
					'<div class="vokal-datepicker" x-ng-show="showDatepicker">' +
					'<div class="month-name">{{ monthName }} {{ year }}</div>' +
					'<div class="month-prev" x-ng-click="buildMonth( prevYear, prevMonth )">&lt;</div>' +
					'<div class="month-next" x-ng-click="buildMonth( nextYear, nextMonth )">&gt;</div>' +
					'<div class="day-name-cell" x-ng-repeat="dayName in dayNames">{{ dayName }}</div>' +
					'<div class="filler-space" x-ng-repeat="space in filler"></div>' +
					'<div class="date-cell" ' +
					'x-ng-class="{ today: dayNow == day && monthNow == month && yearNow == year }" ' +
					'x-ng-repeat="day in days" x-ng-click="applyDate( month + \'/\' + day + \'/\' + year )">' +
					'{{ day }}</div></div>' );
				$compile( template )( scope );
				element.after( template );

				// Show the picker when clicking in the input
				element.on( "click", function ()
				{
					scope.$apply( function ()
					{
						var startingYear, startingMonth;

						if( Date.parse( scope.dateValue ) )
						{
							var dateStarting = new Date( scope.dateValue );
							startingYear     = dateStarting.getFullYear();
							startingMonth    = dateStarting.getMonth() + 1;
						}
						else
						{
							startingYear     = scope.yearNow;
							startingMonth    = scope.monthNow;
						}

						scope.buildMonth( startingYear, startingMonth );

						scope.showDatepicker = true;
					} );

				} );

				// Hide the picker when typing in the field
				element.on( "keydown paste", function ()
				{
					scope.$apply( function ()
					{
						scope.showDatepicker = false;
					} );
				} );

				// Hide the picker when clicking away
				$( "body" ).on( "mousedown touchstart", function ( event )
				{
					scope.$apply( function ()
					{
						if( !$( event.target ).closest(
							".vokal-datepicker, [x-vokal-datepicker=" + attrs.vokalDatepicker + "]"
						).length )
						{
							scope.showDatepicker = false;
						}
					} );
				} );

			}
		};
	}

] )


// Attach a time picker to a text input field
.directive( "vokalTimepicker", [ "$compile", "$filter",

	function ( $compile, $filter )
	{
		// Usage: <input type="text" x-ng-model="modelName" x-vokal-timepicker="modelName"
		//                           x-vokal-timepicker-options='{ "interval": 30 }'>

		return {
			restrict: "A",
			scope: { timeValue: "=vokalTimepicker" },
			require: "ngModel",
			link: function ( scope, element, attrs, ngModelController )
			{
				// Convert data from view to model format and validate
				ngModelController.$parsers.unshift( function( data )
				{
					var timeData = new Date( "1/1/1990 " + data );

					ngModelController.$setValidity( "time", !isNaN( timeData.getTime() ) );

					return timeData;
				} );

				// Convert data from model to view format and validate
				ngModelController.$formatters.unshift( function( data )
				{
					if( data )
					{
						ngModelController.$setValidity( "time", !isNaN( data.getTime() ) );
					}

					return data ? $filter( "date" )( data, "shortTime" ) : "";
				} );

				// Initialize
				scope.times = [];
				scope.showTimepicker = false;
				var options  = attrs.vokalTimepickerOptions ? JSON.parse( attrs.vokalTimepickerOptions ) : {};
				var interval = options.interval || 60;
				var hour, minute, apm;

				// Build array of time objects by interval
				for( var i = 0; i < 24; i++ )
				{
					for( var k = 0; k < 60; k += interval )
					{
						hour   = i > 12 ? i - 12 : i;
						hour   = hour === 0 ? hour + 12 : hour;
						minute = k < 10 ? "0" + k : k;
						apm    = i > 11 ? "PM" : "AM";
						scope.times.push( { display: hour + ":" + minute + " " + apm, value: i + ":" + minute } );
					}
				}

				// Function to put selected time in the scope
				scope.applyTime = function ( selectedTime )
				{
					scope.timeValue = new Date( "1/1/1990 " + selectedTime );
					scope.showTimepicker = false;
				};

				// Build picker template and register with the directive scope
				var template = angular.element(
					'<div class="vokal-timepicker" x-ng-show="showTimepicker">' +
					'<div x-ng-repeat="time in times" x-ng-click="applyTime( time.display )">' +
					'{{ time.display }}</div></div>' );
				$compile( template )( scope );
				element.after( template );

				// Show the picker when clicking in the input
				element.on( "click", function ()
				{
					scope.$apply( function ()
					{
						scope.showTimepicker = true;
					} );
				} );

				// Hide the picker when typing in the field
				element.on( "keydown paste", function ()
				{
					scope.$apply( function ()
					{
						scope.showTimepicker = false;
					} );
				} );

				// Hide the picker when clicking away
				$( "body" ).on( "mousedown touchstart", function ( event )
				{
					scope.$apply( function ()
					{
						if( !$( event.target ).closest(
							".vokal-timepicker, [x-vokal-timepicker=" + attrs.vokalTimepicker + "]"
						).length )
						{
							scope.showTimepicker = false;
						}
					} );
				} );

			}
		};
	}

] );

"use strict";

/* Filters */

angular.module( "vokal.filters", [] );


"use strict";

/* Services */

var svcMod = angular.module( "vokal.services", [] );

svcMod.factory( "EmailService", function ( $http, $rootScope ) {

    var emailService = {};

    emailService.send = function ( data ) {

	    var emailObject = {
		    "key": "wBlMhtN_NP65gijrfoap7w",
		    "template_name": "gotclocked",
		    "template_content": [
		        {
		            "name": "gotclocked"
		        }
		    ],
		    "message": {
		        "html": "",
		        "text": "Example text content",
		        "subject": "Here are your meeting deets!",
		        "from_email": "you@gotclocked.com",
		        "from_name": "GotClocked.com",
		        "to": [
		            {
		                "email": data.email,
		                "name": "GotClocked User",
		                "type": "to"
		            }
		        ],
		        "headers": {
		            "Reply-To": "you@gotclocked.com"
		        },
		        "important": false,
		        "track_opens": null,
		        "track_clicks": null,
		        "auto_text": null,
		        "auto_html": null,
		        "inline_css": null,
		        "url_strip_qs": null,
		        "preserve_recipients": null,
		        "view_content_link": null,
		        "tracking_domain": null,
		        "signing_domain": null,
		        "return_path_domain": null,
		        "merge": true,
				"global_merge_vars": [
				    {
				        "name": "var1",
				        "content": "Global Value 1"
				    }
				],
				"merge_vars": [
				    {
				        "rcpt": data.email,
				        "vars": [
				            {
				                "name": "timesent",
				                "content": data.timeSent
				            },
				            {
				                "name": "totaltime",
				                "content": data.time
				            },
				            {
				                "name": "participants",
				                "content": data.participants
				            },
				            {
				                "name": "groupaverage",
				                "content": data.groupAvg
				            },
				            {
				                "name": "totalcost",
				                "content": data.spent
				            },
				            {
				                "name": "perhrcost",
				                "content": data.perHrCost
				            }

				        ]
				    }
				],
		        "google_analytics_domains": [
		            "gotclocked.com"
		        ],
		        "google_analytics_campaign": "message.from_email@example.com",
		        "metadata": {
		            "website": "www.gotclocked.com"
		        },
		        "recipient_metadata": [
		            {
		                "rcpt": "recipient.email@example.com",
		                "values": {
		                    "user_id": 123456
		                }
		            }
		        ]
		    },
		    "async": false,
		    "ip_pool": "Main Pool"
		};


        return $http.post( "https://mandrillapp.com/api/1.0/messages/send-template.json", emailObject )
        .then( function ( res )
        {
        	$rootScope.$broadcast( "emailSuccess" );
        });
    };

    return emailService;

});


// Check for and attach token on all API requests
svcMod.factory( "API", [ "$http", "$rootScope", "$location", "$q",

	function ( $http, $rootScope, $location, $q )
	{
		var apiRequest = function( method, path, requestData )
		{
			var headers = { "AUTHORIZATION": "Token " + $rootScope.authToken };
			var options = { method: method, url: path, headers: headers, data: requestData || {} };

			if( method === "postFile" )
			{
				headers[ "Content-Type" ] = undefined;  // To ensure multipart boundary is added
				options.method            = "post";
				options.headers           = headers;
				options.transformRequest  = angular.identity;
			}

			var callbacks   = {};
			var canceler    = $q.defer();
			options.timeout = canceler.promise;

			$http( options ).success( function ( data, status, headers, config )
			{
				if( callbacks.success ) { callbacks.success( data, status, headers, config ); }

			} ).error( function ( data, status, headers, config )
			{
				if( status === 401 || status === 403 )
				{
					var loginPath = "/login/";

					if( $location.path() !== loginPath )
					{
						$location.path( loginPath );
						return;
					}
				}

				if( callbacks.error ) { callbacks.error( data, status, headers, config ); }

			} );

			var methods = {

				$cancel: function ()
				{
					canceler.resolve( "Request canceled" );
				},
				success: function ( callback )
				{
					callbacks.success = callback;
					return methods;
				},
				error: function ( callback )
				{
					callbacks.error = callback;
					return methods;
				}
			};

			return methods;
		};

		return {
			$get:      function( path ) {              return apiRequest( "get", path, {} ); },
			$post:     function( path, requestData ) { return apiRequest( "post", path, requestData ); },
			$postFile: function( path, requestData ) { return apiRequest( "postFile", path, requestData ); },
			$put:      function( path, requestData ) { return apiRequest( "put", path, requestData ); },
			$patch:    function( path, requestData ) { return apiRequest( "patch", path, requestData ); },
			$delete:   function( path ) {              return apiRequest( "delete", path, {} ); }
		};

	}

] );
