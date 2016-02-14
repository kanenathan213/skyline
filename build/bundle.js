/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var myFirebaseRef = new Firebase("https://skyline-maps.firebaseio.com/");
	var places_list_ref = new Firebase("https://skyline-maps.firebaseio.com/places");

	var noUiSlider = __webpack_require__(1);

	__webpack_require__(2);

	console.log(wNumb);

	var places_list = {};

	var ideal_temp = 22;
	var ideal_precip = 0;

	var number_of_ideal_months = 4;

	places_list_ref.on("value", function(snapshot) {
	  places_list = snapshot.val();
	  console.log(places_list);
	  renderCities();
	  var best_weather_months = findBestMonths(places_list["Bangkok"]);
	  console.log(best_weather_months);

	}, function (errorObject) {
	  console.log("The read failed: " + errorObject.code);
	});


	// var WU_API_KEY = '';
	//
	// var config_ref = myFirebaseRef.child("config/WU_API_KEY");
	//
	// config_ref.on("value", function(snapshot) {
	//   WU_API_KEY = snapshot.val();
	//   renderCities();
	// }, function (errorObject) {
	//   console.log("The read failed: " + errorObject.code);
	// });

	var map = null;

	var initMap = function() {

	  map = new google.maps.Map(document.getElementById('map'), {
	    center: {lat: 20, lng: 20},
	    scrollwheel: true,
	    zoom: 2,
	    minZoom: 2
	  });

	 var connectSlider = document.getElementById('temperature-range');

	 noUiSlider.create(connectSlider, {
	 	start: [weather_ranges.temperature.bottom, weather_ranges.temperature.top],
	 	connect: true,
	    tooltips: [true, true],
	 	range: {
	 		'min': 0,
	 		'max': 100
	 	},
	    margin: 10,
	    direction: 'rtl',
	    orientation: 'vertical',
	    format: wNumb({
			decimals: 0,
			postfix: '&#' + 8457,
		})
	 });

	 var connectBar = document.createElement('div'),
		connectBase = connectSlider.getElementsByClassName('noUi-base')[0],
		connectHandles = connectSlider.getElementsByClassName('noUi-origin');

	 connectSlider.noUiSlider.on('update', function( values, handle ) {

	 	var side = handle ? 'right' : 'left',
	 		offset = (connectHandles[handle].style.left).slice(0, - 1);

	 	if ( handle === 1 ) {
	 		offset = 100 - offset;
	 	}

	 	connectBar.style[side] = offset + '%';

	    weather_ranges.temperature.bottom = connectSlider.noUiSlider.get()[0].replace(/&#8457/g,'');
	    weather_ranges.temperature.top = connectSlider.noUiSlider.get()[1].replace(/&#8457/g,'');
	    renderCities();
	 });

	 var precipitationSlider = document.getElementById('precipitation-range');

	 noUiSlider.create(precipitationSlider, {
	 	start: [weather_ranges.precipitation.bottom, weather_ranges.precipitation.top],
	 	connect: true,
	    margin: 10,
	    tooltips: [true, true],
	 	range: {
	 		'min': 0,
	 		'max': 100
	 	},
	    direction: 'rtl',
	    orientation: 'vertical',
	    format: wNumb({
	        decimals: 0,
	        postfix: '%',
	    })
	 });


	 var precipConnectBar = document.createElement('div'),
		precipConnectBase = precipitationSlider.getElementsByClassName('noUi-base')[0],
		precipConnectHandles = precipitationSlider.getElementsByClassName('noUi-origin');

	 precipitationSlider.noUiSlider.on('update', function( values, handle ) {

	 	var side = handle ? 'right' : 'left',
	 		offset = (precipConnectHandles[handle].style.left).slice(0, - 1);

	 	if ( handle === 1 ) {
	 		offset = 100 - offset;
	 	}

	 	precipConnectBar.style[side] = offset + '%';

	    weather_ranges.precipitation.bottom = precipitationSlider.noUiSlider.get()[0].replace(/%/g, '');
	    weather_ranges.precipitation.top = precipitationSlider.noUiSlider.get()[1].replace(/%/g, '');
	    renderCities();
	 });
	}

	function sortWeather(sortedPrecip, sortedTemp) {

	    return sortedWeather;
	}

	function sortDecreasingTemp(city_data) {

	    return sortedTemp;
	}

	function sortDecreasingPrecip(city_data) {

	    return sortedPrecip;
	}

	function findBestMonths(city_data) {

	    var precip_array = [];
	    var temp_array = [];

	    for (var i = 0; i < city_data.length; i++) {

	        var raw_precip_percentage = city_data[i].chance_of.chanceofprecip.percentage;
	        var formatted_precip_percentage = Number(raw_precip_percentage);

	        var raw_high_temp_avg = city_data[i].temp_high.avg['C'];
	        var raw_low_temp_avg = city_data[i].temp_low.avg['C'];

	        var formatted_avg_temp = (Number(raw_high_temp_avg) + Number(raw_low_temp_avg))/2;

	        var difference_from_ideal_temp = Math.abs(ideal_temp - formatted_avg_temp);

	        precip_array.push([formatted_precip_percentage, i]);
	        temp_array.push([difference_from_ideal_temp, i]);

	    }

	    // precip_array.sort(function(a, b) {
	    //     return a - b;
	    // });
	    //
	    // temp_diff.sort(function(a, b) {
	    //     return a - b;
	    // });

	    // var precip_indic = precip_array.splice(0,4);
	    //

	    var precip_months = sortMonths(precip_array);
	    var temperature_months = sortMonths(temp_array);

	    console.log(precip_months, temperature_months);

	    var weather_scores = [];

	    for (var w = 0; w < 12; w++) {

	        var weather_score_item = precip_array[w][0] / 100 + temp_array[w][0] / 100;

	        weather_scores.push([weather_score_item, w]);

	    }

	    weather_scores = sortMonths(weather_scores);

	    console.log(weather_scores);

	    var weather_score_indices = [];

	    for (var i = 0; i < number_of_ideal_months; i++ ) {

	        weather_score_indices.push(weather_scores[i][1]);

	    }

	    return weather_score_indices;

	}

	function sortMonths(months_with_data) {

	    var months = months_with_data;

	    for (var j = 0; j < months_with_data.length; j++) {

	        for (var k = 0; k < months.length; k++) {

	            var temporary_month = months[k];
	            if (months_with_data[j][0] < months[k][0]) {

	                months[k] = months_with_data[j];
	                months_with_data[j] = temporary_month;
	                break;
	            }
	        }
	    }

	    return months;

	}

	function renderCities() {

	    deleteMarkers();
	    var latitude, longitude;
	    for (var key in places_list) {

	        var precip_chance = places_list[key][selected_month].chance_of.chanceofprecip.percentage;

	        if (Number(precip_chance) < Number(weather_ranges.precipitation.top)
	            && Number(precip_chance) > Number(weather_ranges.precipitation.bottom))
	            {
	                console.log("made it through precipitation band");

	                if (places_list[key][selected_month].temp_high.avg["F"] < Number(weather_ranges.temperature.top)
	                    && places_list[key][selected_month].temp_high.avg["F"] > Number(weather_ranges.temperature.bottom))
	                    {
	                        latitude = places_list[key][0].latitude;
	                        longitude = places_list[key][0].longitude;
	                        prepMarkers(latitude, longitude, key);
	                        setMapOnAll(map);
	                    }
	            }
	    }
	}

	var markers = [];

	function prepMarkers(lat, lng, name) {

	      var infowindow = new google.maps.InfoWindow({
	          content: name
	      });

	      var latLng = {
	          "lat": Number(lat),
	          "lng": Number(lng)
	      }
	      var marker = new google.maps.Marker({
	        position: latLng,
	        map: map,
	        title: 'thing'
	      })

	      marker.addListener('click', function() {
	        infowindow.open(map, marker);
	      });

	      markers.push(marker);
	}

	// Sets the map on all markers in the array.
	function setMapOnAll(map) {
	  for (var i = 0; i < markers.length; i++) {
	    markers[i].setMap(map);
	  }
	}

	// Removes the markers from the map, but keeps them in the array.
	function clearMarkers() {
	  setMapOnAll(null);
	}

	// Deletes all markers in the array by removing references to them.
	function deleteMarkers() {
	  clearMarkers();
	  markers = [];
	}

	function formatMonthForRequest(month) {

	    var monthAsNumber = Number(month);
	    monthAsNumber += 1;

	    var cleanedUpMonth = '';

	    var monthAsString = monthAsNumber.toString();
	    if (monthAsString.length === 1) {
	        cleanedUpMonth = '0'.concat(monthAsString);
	    }
	    else {
	        cleanedUpMonth = monthAsString;
	    }
	    return cleanedUpMonth;
	}

	var selected_month = new Date().getMonth() + 1;
	initializeSelectedMonth();

	var weather_ranges = {
	    "temperature": {
	        "bottom": 37,
	        "top": 80,
	        "scale": 'F'
	    },
	    "precipitation": {
	        "bottom": 0,
	        "top": 40
	    }
	}

	function initializeSelectedMonth() {
	    var month_wrap = document.getElementById("month-wrap-id");

	    if (selected_month === 11) {
	        selected_month = 0;
	    }

	    for (var i = 0; i < month_wrap.children.length; i++) {
	        if (i === selected_month) {
	            month_wrap.children[i].className += " selected";
	            break;
	        }
	    }
	}

	function addSelectedClass(event) {

	    var element = event.target;
	    removeSelectedClass(element.parentNode);
	    element.className += " selected";
	    selected_month = element.value;
	    renderCities();
	}

	function removeSelectedClass(element) {
	    for (var i = 0; i < element.children.length; i++) {
	        element.children[i].className = "month-button";
	    }
	}

	var upload_month = 0;

	var calls_number = document.getElementById("calls-number");

	function updateUICalls() {
	    calls_number.innerHTML = upload_month;
	};

	//updateUICalls();

	function addNewPlace() {
	    var city_name = document.getElementById("place_name").value;
	    var longitude = document.getElementById("longitude").value;
	    var latitude = document.getElementById("latitude").value;

	    var places_ref = myFirebaseRef.child("places/" + city_name + "/" + upload_month);

	    var firebase_payload = {};

	    var xhttp = new XMLHttpRequest();

	        xhttp.onreadystatechange = function() {
	          if (xhttp.readyState == 4 && xhttp.status == 200) {
	              var json_response = JSON.parse(xhttp.response);
	              firebase_payload = json_response.trip;

	              firebase_payload.latitude = latitude;
	              firebase_payload.longitude = longitude;

	              places_ref.set(firebase_payload);
	          }
	        };

	        var request_month = formatMonthForRequest(selected_month);
	        var formatted_upload_month = formatMonthForRequest(upload_month);

	        var filter_date = {
	            month: request_month,
	            start_day: '01',
	            end_day: '28'
	        }

	        var endpoint = "http://api.wunderground.com/api/"
	                         + WU_API_KEY
	                         + "/planner_"
	                         + formatted_upload_month
	                         + filter_date.start_day
	                         + formatted_upload_month
	                         + filter_date.end_day
	                         + "/q/"
	                         + latitude
	                         + ','
	                         + longitude
	                         + ".json";
	        xhttp.open("GET", endpoint, true);
	        xhttp.send();

	        console.log(endpoint);

	        if (upload_month === 11) {
	            clearInterval(pull_interval);
	        }

	        ++upload_month;
	        updateUICalls();
	}

	var pull_interval;

	function startAdding() {
	    pull_interval = setInterval(function() { addNewPlace() }, 10000);
	}

	window.onload = initMap;


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;/*! nouislider - 8.2.1 - 2015-12-02 21:43:14 */

	!function(a){ true?!(__WEBPACK_AMD_DEFINE_ARRAY__ = [], __WEBPACK_AMD_DEFINE_FACTORY__ = (a), __WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ? (__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__)):"object"==typeof exports?module.exports=a():window.noUiSlider=a()}(function(){"use strict";function a(a){return a.filter(function(a){return this[a]?!1:this[a]=!0},{})}function b(a,b){return Math.round(a/b)*b}function c(a){var b=a.getBoundingClientRect(),c=a.ownerDocument,d=c.documentElement,e=m();return/webkit.*Chrome.*Mobile/i.test(navigator.userAgent)&&(e.x=0),{top:b.top+e.y-d.clientTop,left:b.left+e.x-d.clientLeft}}function d(a){return"number"==typeof a&&!isNaN(a)&&isFinite(a)}function e(a){var b=Math.pow(10,7);return Number((Math.round(a*b)/b).toFixed(7))}function f(a,b,c){j(a,b),setTimeout(function(){k(a,b)},c)}function g(a){return Math.max(Math.min(a,100),0)}function h(a){return Array.isArray(a)?a:[a]}function i(a){var b=a.split(".");return b.length>1?b[1].length:0}function j(a,b){a.classList?a.classList.add(b):a.className+=" "+b}function k(a,b){a.classList?a.classList.remove(b):a.className=a.className.replace(new RegExp("(^|\\b)"+b.split(" ").join("|")+"(\\b|$)","gi")," ")}function l(a,b){a.classList?a.classList.contains(b):new RegExp("(^| )"+b+"( |$)","gi").test(a.className)}function m(){var a=void 0!==window.pageXOffset,b="CSS1Compat"===(document.compatMode||""),c=a?window.pageXOffset:b?document.documentElement.scrollLeft:document.body.scrollLeft,d=a?window.pageYOffset:b?document.documentElement.scrollTop:document.body.scrollTop;return{x:c,y:d}}function n(a){a.stopPropagation()}function o(a){return function(b){return a+b}}function p(a,b){return 100/(b-a)}function q(a,b){return 100*b/(a[1]-a[0])}function r(a,b){return q(a,a[0]<0?b+Math.abs(a[0]):b-a[0])}function s(a,b){return b*(a[1]-a[0])/100+a[0]}function t(a,b){for(var c=1;a>=b[c];)c+=1;return c}function u(a,b,c){if(c>=a.slice(-1)[0])return 100;var d,e,f,g,h=t(c,a);return d=a[h-1],e=a[h],f=b[h-1],g=b[h],f+r([d,e],c)/p(f,g)}function v(a,b,c){if(c>=100)return a.slice(-1)[0];var d,e,f,g,h=t(c,b);return d=a[h-1],e=a[h],f=b[h-1],g=b[h],s([d,e],(c-f)*p(f,g))}function w(a,c,d,e){if(100===e)return e;var f,g,h=t(e,a);return d?(f=a[h-1],g=a[h],e-f>(g-f)/2?g:f):c[h-1]?a[h-1]+b(e-a[h-1],c[h-1]):e}function x(a,b,c){var e;if("number"==typeof b&&(b=[b]),"[object Array]"!==Object.prototype.toString.call(b))throw new Error("noUiSlider: 'range' contains invalid value.");if(e="min"===a?0:"max"===a?100:parseFloat(a),!d(e)||!d(b[0]))throw new Error("noUiSlider: 'range' value isn't numeric.");c.xPct.push(e),c.xVal.push(b[0]),e?c.xSteps.push(isNaN(b[1])?!1:b[1]):isNaN(b[1])||(c.xSteps[0]=b[1])}function y(a,b,c){return b?void(c.xSteps[a]=q([c.xVal[a],c.xVal[a+1]],b)/p(c.xPct[a],c.xPct[a+1])):!0}function z(a,b,c,d){this.xPct=[],this.xVal=[],this.xSteps=[d||!1],this.xNumSteps=[!1],this.snap=b,this.direction=c;var e,f=[];for(e in a)a.hasOwnProperty(e)&&f.push([a[e],e]);for(f.length&&"object"==typeof f[0][0]?f.sort(function(a,b){return a[0][0]-b[0][0]}):f.sort(function(a,b){return a[0]-b[0]}),e=0;e<f.length;e++)x(f[e][1],f[e][0],this);for(this.xNumSteps=this.xSteps.slice(0),e=0;e<this.xNumSteps.length;e++)y(e,this.xNumSteps[e],this)}function A(a,b){if(!d(b))throw new Error("noUiSlider: 'step' is not numeric.");a.singleStep=b}function B(a,b){if("object"!=typeof b||Array.isArray(b))throw new Error("noUiSlider: 'range' is not an object.");if(void 0===b.min||void 0===b.max)throw new Error("noUiSlider: Missing 'min' or 'max' in 'range'.");if(b.min===b.max)throw new Error("noUiSlider: 'range' 'min' and 'max' cannot be equal.");a.spectrum=new z(b,a.snap,a.dir,a.singleStep)}function C(a,b){if(b=h(b),!Array.isArray(b)||!b.length||b.length>2)throw new Error("noUiSlider: 'start' option is incorrect.");a.handles=b.length,a.start=b}function D(a,b){if(a.snap=b,"boolean"!=typeof b)throw new Error("noUiSlider: 'snap' option must be a boolean.")}function E(a,b){if(a.animate=b,"boolean"!=typeof b)throw new Error("noUiSlider: 'animate' option must be a boolean.")}function F(a,b){if("lower"===b&&1===a.handles)a.connect=1;else if("upper"===b&&1===a.handles)a.connect=2;else if(b===!0&&2===a.handles)a.connect=3;else{if(b!==!1)throw new Error("noUiSlider: 'connect' option doesn't match handle count.");a.connect=0}}function G(a,b){switch(b){case"horizontal":a.ort=0;break;case"vertical":a.ort=1;break;default:throw new Error("noUiSlider: 'orientation' option is invalid.")}}function H(a,b){if(!d(b))throw new Error("noUiSlider: 'margin' option must be numeric.");if(a.margin=a.spectrum.getMargin(b),!a.margin)throw new Error("noUiSlider: 'margin' option is only supported on linear sliders.")}function I(a,b){if(!d(b))throw new Error("noUiSlider: 'limit' option must be numeric.");if(a.limit=a.spectrum.getMargin(b),!a.limit)throw new Error("noUiSlider: 'limit' option is only supported on linear sliders.")}function J(a,b){switch(b){case"ltr":a.dir=0;break;case"rtl":a.dir=1,a.connect=[0,2,1,3][a.connect];break;default:throw new Error("noUiSlider: 'direction' option was not recognized.")}}function K(a,b){if("string"!=typeof b)throw new Error("noUiSlider: 'behaviour' must be a string containing options.");var c=b.indexOf("tap")>=0,d=b.indexOf("drag")>=0,e=b.indexOf("fixed")>=0,f=b.indexOf("snap")>=0,g=b.indexOf("hover")>=0;if(d&&!a.connect)throw new Error("noUiSlider: 'drag' behaviour must be used with 'connect': true.");a.events={tap:c||f,drag:d,fixed:e,snap:f,hover:g}}function L(a,b){var c;if(b!==!1)if(b===!0)for(a.tooltips=[],c=0;c<a.handles;c++)a.tooltips.push(!0);else{if(a.tooltips=h(b),a.tooltips.length!==a.handles)throw new Error("noUiSlider: must pass a formatter for all handles.");a.tooltips.forEach(function(a){if("boolean"!=typeof a&&("object"!=typeof a||"function"!=typeof a.to))throw new Error("noUiSlider: 'tooltips' must be passed a formatter or 'false'.")})}}function M(a,b){if(a.format=b,"function"==typeof b.to&&"function"==typeof b.from)return!0;throw new Error("noUiSlider: 'format' requires 'to' and 'from' methods.")}function N(a,b){if(void 0!==b&&"string"!=typeof b)throw new Error("noUiSlider: 'cssPrefix' must be a string.");a.cssPrefix=b}function O(a){var b,c={margin:0,limit:0,animate:!0,format:T};b={step:{r:!1,t:A},start:{r:!0,t:C},connect:{r:!0,t:F},direction:{r:!0,t:J},snap:{r:!1,t:D},animate:{r:!1,t:E},range:{r:!0,t:B},orientation:{r:!1,t:G},margin:{r:!1,t:H},limit:{r:!1,t:I},behaviour:{r:!0,t:K},format:{r:!1,t:M},tooltips:{r:!1,t:L},cssPrefix:{r:!1,t:N}};var d={connect:!1,direction:"ltr",behaviour:"tap",orientation:"horizontal"};return Object.keys(b).forEach(function(e){if(void 0===a[e]&&void 0===d[e]){if(b[e].r)throw new Error("noUiSlider: '"+e+"' is required.");return!0}b[e].t(c,void 0===a[e]?d[e]:a[e])}),c.pips=a.pips,c.style=c.ort?"top":"left",c}function P(b,d){function e(a,b,c){var d=a+b[0],e=a+b[1];return c?(0>d&&(e+=Math.abs(d)),e>100&&(d-=e-100),[g(d),g(e)]):[d,e]}function p(a,b){a.preventDefault();var c,d,e=0===a.type.indexOf("touch"),f=0===a.type.indexOf("mouse"),g=0===a.type.indexOf("pointer"),h=a;return 0===a.type.indexOf("MSPointer")&&(g=!0),e&&(c=a.changedTouches[0].pageX,d=a.changedTouches[0].pageY),b=b||m(),(f||g)&&(c=a.clientX+b.x,d=a.clientY+b.y),h.pageOffset=b,h.points=[c,d],h.cursor=f||g,h}function q(a,b){var c=document.createElement("div"),d=document.createElement("div"),e=["-lower","-upper"];return a&&e.reverse(),j(d,da[3]),j(d,da[3]+e[b]),j(c,da[2]),c.appendChild(d),c}function r(a,b,c){switch(a){case 1:j(b,da[7]),j(c[0],da[6]);break;case 3:j(c[1],da[6]);case 2:j(c[0],da[7]);case 0:j(b,da[6])}}function s(a,b,c){var d,e=[];for(d=0;a>d;d+=1)e.push(c.appendChild(q(b,d)));return e}function t(a,b,c){j(c,da[0]),j(c,da[8+a]),j(c,da[4+b]);var d=document.createElement("div");return j(d,da[1]),c.appendChild(d),d}function u(a,b){if(!d.tooltips[b])return!1;var c=document.createElement("div");return c.className=da[18],a.firstChild.appendChild(c)}function v(){d.dir&&d.tooltips.reverse();var a=Y.map(u);d.dir&&(a.reverse(),d.tooltips.reverse()),U("update",function(b,c,e){a[c]&&(a[c].innerHTML=d.tooltips[c]===!0?b[c]:d.tooltips[c].to(e[c]))})}function w(a,b,c){if("range"===a||"steps"===a)return aa.xVal;if("count"===a){var d,e=100/(b-1),f=0;for(b=[];(d=f++*e)<=100;)b.push(d);a="positions"}return"positions"===a?b.map(function(a){return aa.fromStepping(c?aa.getStep(a):a)}):"values"===a?c?b.map(function(a){return aa.fromStepping(aa.getStep(aa.toStepping(a)))}):b:void 0}function x(b,c,d){function e(a,b){return(a+b).toFixed(7)/1}var f=aa.direction,g={},h=aa.xVal[0],i=aa.xVal[aa.xVal.length-1],j=!1,k=!1,l=0;return aa.direction=0,d=a(d.slice().sort(function(a,b){return a-b})),d[0]!==h&&(d.unshift(h),j=!0),d[d.length-1]!==i&&(d.push(i),k=!0),d.forEach(function(a,f){var h,i,m,n,o,p,q,r,s,t,u=a,v=d[f+1];if("steps"===c&&(h=aa.xNumSteps[f]),h||(h=v-u),u!==!1&&void 0!==v)for(i=u;v>=i;i=e(i,h)){for(n=aa.toStepping(i),o=n-l,r=o/b,s=Math.round(r),t=o/s,m=1;s>=m;m+=1)p=l+m*t,g[p.toFixed(5)]=["x",0];q=d.indexOf(i)>-1?1:"steps"===c?2:0,!f&&j&&(q=0),i===v&&k||(g[n.toFixed(5)]=[i,q]),l=n}}),aa.direction=f,g}function y(a,b,c){function e(a){return["-normal","-large","-sub"][a]}function f(a,b,c){return'class="'+b+" "+b+"-"+h+" "+b+e(c[1])+'" style="'+d.style+": "+a+'%"'}function g(a,d){aa.direction&&(a=100-a),d[1]=d[1]&&b?b(d[0],d[1]):d[1],i.innerHTML+="<div "+f(a,da[21],d)+"></div>",d[1]&&(i.innerHTML+="<div "+f(a,da[22],d)+">"+c.to(d[0])+"</div>")}var h=["horizontal","vertical"][d.ort],i=document.createElement("div");return j(i,da[20]),j(i,da[20]+"-"+h),Object.keys(a).forEach(function(b){g(b,a[b])}),i}function z(a){var b=a.mode,c=a.density||1,d=a.filter||!1,e=a.values||!1,f=a.stepped||!1,g=w(b,e,f),h=x(c,b,g),i=a.format||{to:Math.round};return $.appendChild(y(h,d,i))}function A(){return X["offset"+["Width","Height"][d.ort]]}function B(a,b,c){void 0!==b&&1!==d.handles&&(b=Math.abs(b-d.dir)),Object.keys(ca).forEach(function(d){var e=d.split(".")[0];a===e&&ca[d].forEach(function(a){a.call(Z,h(P()),b,h(C(Array.prototype.slice.call(ba))),c||!1)})})}function C(a){return 1===a.length?a[0]:d.dir?a.reverse():a}function D(a,b,c,e){var f=function(b){return $.hasAttribute("disabled")?!1:l($,da[14])?!1:(b=p(b,e.pageOffset),a===R.start&&void 0!==b.buttons&&b.buttons>1?!1:e.hover&&b.buttons?!1:(b.calcPoint=b.points[d.ort],void c(b,e)))},g=[];return a.split(" ").forEach(function(a){b.addEventListener(a,f,!1),g.push([a,f])}),g}function E(a,b){if(-1===navigator.appVersion.indexOf("MSIE 9")&&0===a.buttons&&0!==b.buttonsProperty)return F(a,b);var c,d,f=b.handles||Y,g=!1,h=100*(a.calcPoint-b.start)/b.baseSize,i=f[0]===Y[0]?0:1;if(c=e(h,b.positions,f.length>1),g=L(f[0],c[i],1===f.length),f.length>1){if(g=L(f[1],c[i?0:1],!1)||g)for(d=0;d<b.handles.length;d++)B("slide",d)}else g&&B("slide",i)}function F(a,b){var c=X.querySelector("."+da[15]),d=b.handles[0]===Y[0]?0:1;null!==c&&k(c,da[15]),a.cursor&&(document.body.style.cursor="",document.body.removeEventListener("selectstart",document.body.noUiListener));var e=document.documentElement;e.noUiListeners.forEach(function(a){e.removeEventListener(a[0],a[1])}),k($,da[12]),B("set",d),B("change",d),void 0!==b.handleNumber&&B("end",b.handleNumber)}function G(a,b){"mouseout"===a.type&&"HTML"===a.target.nodeName&&null===a.relatedTarget&&F(a,b)}function H(a,b){var c=document.documentElement;if(1===b.handles.length&&(j(b.handles[0].children[0],da[15]),b.handles[0].hasAttribute("disabled")))return!1;a.preventDefault(),a.stopPropagation();var d=D(R.move,c,E,{start:a.calcPoint,baseSize:A(),pageOffset:a.pageOffset,handles:b.handles,handleNumber:b.handleNumber,buttonsProperty:a.buttons,positions:[_[0],_[Y.length-1]]}),e=D(R.end,c,F,{handles:b.handles,handleNumber:b.handleNumber}),f=D("mouseout",c,G,{handles:b.handles,handleNumber:b.handleNumber});if(c.noUiListeners=d.concat(e,f),a.cursor){document.body.style.cursor=getComputedStyle(a.target).cursor,Y.length>1&&j($,da[12]);var g=function(){return!1};document.body.noUiListener=g,document.body.addEventListener("selectstart",g,!1)}void 0!==b.handleNumber&&B("start",b.handleNumber)}function I(a){var b,e,g=a.calcPoint,h=0;return a.stopPropagation(),Y.forEach(function(a){h+=c(a)[d.style]}),b=h/2>g||1===Y.length?0:1,g-=c(X)[d.style],e=100*g/A(),d.events.snap||f($,da[14],300),Y[b].hasAttribute("disabled")?!1:(L(Y[b],e),B("slide",b,!0),B("set",b,!0),B("change",b,!0),void(d.events.snap&&H(a,{handles:[Y[b]]})))}function J(a){var b=a.calcPoint-c(X)[d.style],e=aa.getStep(100*b/A()),f=aa.fromStepping(e);Object.keys(ca).forEach(function(a){"hover"===a.split(".")[0]&&ca[a].forEach(function(a){a.call(Z,f)})})}function K(a){var b,c;if(!a.fixed)for(b=0;b<Y.length;b+=1)D(R.start,Y[b].children[0],H,{handles:[Y[b]],handleNumber:b});if(a.tap&&D(R.start,X,I,{handles:Y}),a.hover)for(D(R.move,X,J,{hover:!0}),b=0;b<Y.length;b+=1)["mousemove MSPointerMove pointermove"].forEach(function(a){Y[b].children[0].addEventListener(a,n,!1)});a.drag&&(c=[X.querySelector("."+da[7])],j(c[0],da[10]),a.fixed&&c.push(Y[c[0]===Y[0]?1:0].children[0]),c.forEach(function(a){D(R.start,a,H,{handles:Y})}))}function L(a,b,c){var e=a!==Y[0]?1:0,f=_[0]+d.margin,h=_[1]-d.margin,i=_[0]+d.limit,l=_[1]-d.limit;return Y.length>1&&(b=e?Math.max(b,f):Math.min(b,h)),c!==!1&&d.limit&&Y.length>1&&(b=e?Math.min(b,i):Math.max(b,l)),b=aa.getStep(b),b=g(parseFloat(b.toFixed(7))),b===_[e]?!1:(window.requestAnimationFrame?window.requestAnimationFrame(function(){a.style[d.style]=b+"%"}):a.style[d.style]=b+"%",a.previousSibling||(k(a,da[17]),b>50&&j(a,da[17])),_[e]=b,ba[e]=aa.fromStepping(b),B("update",e),!0)}function M(a,b){var c,e,f;for(d.limit&&(a+=1),c=0;a>c;c+=1)e=c%2,f=b[e],null!==f&&f!==!1&&("number"==typeof f&&(f=String(f)),f=d.format.from(f),(f===!1||isNaN(f)||L(Y[e],aa.toStepping(f),c===3-d.dir)===!1)&&B("update",e))}function N(a){var b,c,e=h(a);for(d.dir&&d.handles>1&&e.reverse(),d.animate&&-1!==_[0]&&f($,da[14],300),b=Y.length>1?3:1,1===e.length&&(b=1),M(b,e),c=0;c<Y.length;c++)B("set",c)}function P(){var a,b=[];for(a=0;a<d.handles;a+=1)b[a]=d.format.to(ba[a]);return C(b)}function Q(){da.forEach(function(a){a&&k($,a)}),$.innerHTML="",delete $.noUiSlider}function T(){var a=_.map(function(a,b){var c=aa.getApplicableStep(a),d=i(String(c[2])),e=ba[b],f=100===a?null:c[2],g=Number((e-c[2]).toFixed(d)),h=0===a?null:g>=c[1]?c[2]:c[0]||!1;return[h,f]});return C(a)}function U(a,b){ca[a]=ca[a]||[],ca[a].push(b),"update"===a.split(".")[0]&&Y.forEach(function(a,b){B("update",b)})}function V(a){var b=a.split(".")[0],c=a.substring(b.length);Object.keys(ca).forEach(function(a){var d=a.split(".")[0],e=a.substring(d.length);b&&b!==d||c&&c!==e||delete ca[a]})}function W(a){var b,c=P(),e=O({start:[0,0],margin:a.margin,limit:a.limit,step:a.step,range:a.range,animate:a.animate,snap:void 0===a.snap?d.snap:a.snap});for(["margin","limit","step","range","animate"].forEach(function(b){void 0!==a[b]&&(d[b]=a[b])}),aa=e.spectrum,_=[-1,-1],N(c),b=0;b<Y.length;b++)B("update",b)}var X,Y,Z,$=b,_=[-1,-1],aa=d.spectrum,ba=[],ca={},da=["target","base","origin","handle","horizontal","vertical","background","connect","ltr","rtl","draggable","","state-drag","","state-tap","active","","stacking","tooltip","","pips","marker","value"].map(o(d.cssPrefix||S));if($.noUiSlider)throw new Error("Slider was already initialized.");return X=t(d.dir,d.ort,$),Y=s(d.handles,d.dir,X),r(d.connect,$,Y),d.pips&&z(d.pips),d.tooltips&&v(),Z={destroy:Q,steps:T,on:U,off:V,get:P,set:N,updateOptions:W},K(d.events),Z}function Q(a,b){if(!a.nodeName)throw new Error("noUiSlider.create requires a single element.");var c=O(b,a),d=P(a,c);return d.set(c.start),a.noUiSlider=d,d}var R=window.navigator.pointerEnabled?{start:"pointerdown",move:"pointermove",end:"pointerup"}:window.navigator.msPointerEnabled?{start:"MSPointerDown",move:"MSPointerMove",end:"MSPointerUp"}:{start:"mousedown touchstart",move:"mousemove touchmove",end:"mouseup touchend"},S="noUi-";z.prototype.getMargin=function(a){return 2===this.xPct.length?q(this.xVal,a):!1},z.prototype.toStepping=function(a){return a=u(this.xVal,this.xPct,a),this.direction&&(a=100-a),a},z.prototype.fromStepping=function(a){return this.direction&&(a=100-a),e(v(this.xVal,this.xPct,a))},z.prototype.getStep=function(a){return this.direction&&(a=100-a),a=w(this.xPct,this.xSteps,this.snap,a),this.direction&&(a=100-a),a},z.prototype.getApplicableStep=function(a){var b=t(a,this.xPct),c=100===a?2:1;return[this.xNumSteps[b-2],this.xVal[b-c],this.xNumSteps[b-c]]},z.prototype.convert=function(a){return this.getStep(this.toStepping(a))};var T={to:function(a){return void 0!==a&&a.toFixed(2)},from:Number};return{create:Q}});

/***/ },
/* 2 */
/***/ function(module, exports) {

	(function(){

		'use strict';

	var
	/** @const */ FormatOptions = [
		'decimals',
		'thousand',
		'mark',
		'prefix',
		'postfix',
		'encoder',
		'decoder',
		'negativeBefore',
		'negative',
		'edit',
		'undo'
	];

	// General

		// Reverse a string
		function strReverse ( a ) {
			return a.split('').reverse().join('');
		}

		// Check if a string starts with a specified prefix.
		function strStartsWith ( input, match ) {
			return input.substring(0, match.length) === match;
		}

		// Check is a string ends in a specified postfix.
		function strEndsWith ( input, match ) {
			return input.slice(-1 * match.length) === match;
		}

		// Throw an error if formatting options are incompatible.
		function throwEqualError( F, a, b ) {
			if ( (F[a] || F[b]) && (F[a] === F[b]) ) {
				throw new Error(a);
			}
		}

		// Check if a number is finite and not NaN
		function isValidNumber ( input ) {
			return typeof input === 'number' && isFinite( input );
		}

		// Provide rounding-accurate toFixed method.
		function toFixed ( value, decimals ) {
			var scale = Math.pow(10, decimals);
			return ( Math.round(value * scale) / scale).toFixed( decimals );
		}


	// Formatting

		// Accept a number as input, output formatted string.
		function formatTo ( decimals, thousand, mark, prefix, postfix, encoder, decoder, negativeBefore, negative, edit, undo, input ) {

			var originalInput = input, inputIsNegative, inputPieces, inputBase, inputDecimals = '', output = '';

			// Apply user encoder to the input.
			// Expected outcome: number.
			if ( encoder ) {
				input = encoder(input);
			}

			// Stop if no valid number was provided, the number is infinite or NaN.
			if ( !isValidNumber(input) ) {
				return false;
			}

			// Rounding away decimals might cause a value of -0
			// when using very small ranges. Remove those cases.
			if ( decimals !== false && parseFloat(input.toFixed(decimals)) === 0 ) {
				input = 0;
			}

			// Formatting is done on absolute numbers,
			// decorated by an optional negative symbol.
			if ( input < 0 ) {
				inputIsNegative = true;
				input = Math.abs(input);
			}

			// Reduce the number of decimals to the specified option.
			if ( decimals !== false ) {
				input = toFixed( input, decimals );
			}

			// Transform the number into a string, so it can be split.
			input = input.toString();

			// Break the number on the decimal separator.
			if ( input.indexOf('.') !== -1 ) {
				inputPieces = input.split('.');

				inputBase = inputPieces[0];

				if ( mark ) {
					inputDecimals = mark + inputPieces[1];
				}

			} else {

			// If it isn't split, the entire number will do.
				inputBase = input;
			}

			// Group numbers in sets of three.
			if ( thousand ) {
				inputBase = strReverse(inputBase).match(/.{1,3}/g);
				inputBase = strReverse(inputBase.join( strReverse( thousand ) ));
			}

			// If the number is negative, prefix with negation symbol.
			if ( inputIsNegative && negativeBefore ) {
				output += negativeBefore;
			}

			// Prefix the number
			if ( prefix ) {
				output += prefix;
			}

			// Normal negative option comes after the prefix. Defaults to '-'.
			if ( inputIsNegative && negative ) {
				output += negative;
			}

			// Append the actual number.
			output += inputBase;
			output += inputDecimals;

			// Apply the postfix.
			if ( postfix ) {
				output += postfix;
			}

			// Run the output through a user-specified post-formatter.
			if ( edit ) {
				output = edit ( output, originalInput );
			}

			// All done.
			return output;
		}

		// Accept a sting as input, output decoded number.
		function formatFrom ( decimals, thousand, mark, prefix, postfix, encoder, decoder, negativeBefore, negative, edit, undo, input ) {

			var originalInput = input, inputIsNegative, output = '';

			// User defined pre-decoder. Result must be a non empty string.
			if ( undo ) {
				input = undo(input);
			}

			// Test the input. Can't be empty.
			if ( !input || typeof input !== 'string' ) {
				return false;
			}

			// If the string starts with the negativeBefore value: remove it.
			// Remember is was there, the number is negative.
			if ( negativeBefore && strStartsWith(input, negativeBefore) ) {
				input = input.replace(negativeBefore, '');
				inputIsNegative = true;
			}

			// Repeat the same procedure for the prefix.
			if ( prefix && strStartsWith(input, prefix) ) {
				input = input.replace(prefix, '');
			}

			// And again for negative.
			if ( negative && strStartsWith(input, negative) ) {
				input = input.replace(negative, '');
				inputIsNegative = true;
			}

			// Remove the postfix.
			// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/slice
			if ( postfix && strEndsWith(input, postfix) ) {
				input = input.slice(0, -1 * postfix.length);
			}

			// Remove the thousand grouping.
			if ( thousand ) {
				input = input.split(thousand).join('');
			}

			// Set the decimal separator back to period.
			if ( mark ) {
				input = input.replace(mark, '.');
			}

			// Prepend the negative symbol.
			if ( inputIsNegative ) {
				output += '-';
			}

			// Add the number
			output += input;

			// Trim all non-numeric characters (allow '.' and '-');
			output = output.replace(/[^0-9\.\-.]/g, '');

			// The value contains no parse-able number.
			if ( output === '' ) {
				return false;
			}

			// Covert to number.
			output = Number(output);

			// Run the user-specified post-decoder.
			if ( decoder ) {
				output = decoder(output);
			}

			// Check is the output is valid, otherwise: return false.
			if ( !isValidNumber(output) ) {
				return false;
			}

			return output;
		}


	// Framework

		// Validate formatting options
		function validate ( inputOptions ) {

			var i, optionName, optionValue,
				filteredOptions = {};

			for ( i = 0; i < FormatOptions.length; i+=1 ) {

				optionName = FormatOptions[i];
				optionValue = inputOptions[optionName];

				if ( optionValue === undefined ) {

					// Only default if negativeBefore isn't set.
					if ( optionName === 'negative' && !filteredOptions.negativeBefore ) {
						filteredOptions[optionName] = '-';
					// Don't set a default for mark when 'thousand' is set.
					} else if ( optionName === 'mark' && filteredOptions.thousand !== '.' ) {
						filteredOptions[optionName] = '.';
					} else {
						filteredOptions[optionName] = false;
					}

				// Floating points in JS are stable up to 7 decimals.
				} else if ( optionName === 'decimals' ) {
					if ( optionValue >= 0 && optionValue < 8 ) {
						filteredOptions[optionName] = optionValue;
					} else {
						throw new Error(optionName);
					}

				// These options, when provided, must be functions.
				} else if ( optionName === 'encoder' || optionName === 'decoder' || optionName === 'edit' || optionName === 'undo' ) {
					if ( typeof optionValue === 'function' ) {
						filteredOptions[optionName] = optionValue;
					} else {
						throw new Error(optionName);
					}

				// Other options are strings.
				} else {

					if ( typeof optionValue === 'string' ) {
						filteredOptions[optionName] = optionValue;
					} else {
						throw new Error(optionName);
					}
				}
			}

			// Some values can't be extracted from a
			// string if certain combinations are present.
			throwEqualError(filteredOptions, 'mark', 'thousand');
			throwEqualError(filteredOptions, 'prefix', 'negative');
			throwEqualError(filteredOptions, 'prefix', 'negativeBefore');

			return filteredOptions;
		}

		// Pass all options as function arguments
		function passAll ( options, method, input ) {
			var i, args = [];

			// Add all options in order of FormatOptions
			for ( i = 0; i < FormatOptions.length; i+=1 ) {
				args.push(options[FormatOptions[i]]);
			}

			// Append the input, then call the method, presenting all
			// options as arguments.
			args.push(input);
			return method.apply('', args);
		}

		/** @constructor */
		function wNumb ( options ) {

			if ( !(this instanceof wNumb) ) {
				return new wNumb ( options );
			}

			if ( typeof options !== "object" ) {
				return;
			}

			options = validate(options);

			// Call 'formatTo' with proper arguments.
			this.to = function ( input ) {
				return passAll(options, formatTo, input);
			};

			// Call 'formatFrom' with proper arguments.
			this.from = function ( input ) {
				return passAll(options, formatFrom, input);
			};
		}

		/** @export */
		window.wNumb = wNumb;

	}());


/***/ }
/******/ ]);