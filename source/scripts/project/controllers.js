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
