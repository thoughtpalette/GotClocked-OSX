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
