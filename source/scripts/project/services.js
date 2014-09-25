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
