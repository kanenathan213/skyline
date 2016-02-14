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

	var InitializeMap = __webpack_require__(3);
	var BackendInterface = __webpack_require__(4);

	window.onload = InitializeMap.initMap;


/***/ },
/* 1 */,
/* 2 */,
/* 3 */
/***/ function(module, exports) {

	var InitializeMap = {};

	InitializeMap.map = null;

	InitializeMap.initMap = function() {

	  InitializeMap.map = new google.maps.Map(document.getElementById('map'), {
	    center: {lat: 20, lng: 20},
	    scrollwheel: true,
	    zoom: 2,
	    minZoom: 2
	  });
	}

	module.exports = InitializeMap;


/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	var BackendInterface = {};

	var ManageMapMarkers = __webpack_require__(5);
	var OptimalTimeInterval = __webpack_require__(6);

	var myFirebaseRef = new Firebase("https://skyline-maps.firebaseio.com/");
	var places_list_ref = new Firebase("https://skyline-maps.firebaseio.com/places");

	BackendInterface.places_list = {};
	var best_weather_months = [];

	places_list_ref.on("value", function(snapshot) {
	  BackendInterface.places_list = snapshot.val();
	  console.log("this one", BackendInterface.places_list);
	  best_weather_months = OptimalTimeInterval.findBestMonths(BackendInterface.places_list["Bangkok"]);
	  ManageMapMarkers.renderCities(BackendInterface.places_list);

	}, function (errorObject) {
	  console.log("The read failed: " + errorObject.code);
	});

	module.exports = BackendInterface;


/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	var BackendInterface = __webpack_require__(4);
	var InitializeMap = __webpack_require__(3);

	var ManageMapMarkers = {};

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
	        map: InitializeMap.map,
	        title: 'thing'
	      })

	      marker.addListener('click', function() {
	        infowindow.open(InitializeMap.map, marker);
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

	ManageMapMarkers.renderCities = function(cities) {

	    deleteMarkers();
	    var latitude, longitude;
	    for (var key in cities) {

	        latitude = cities[key][0].latitude;
	        longitude = cities[key][0].longitude;
	        prepMarkers(latitude, longitude, key);
	        setMapOnAll(InitializeMap.map);
	    }
	}

	module.exports = ManageMapMarkers;


/***/ },
/* 6 */
/***/ function(module, exports) {

	var OptimalTimeInterval = {};

	var ideal_temp = 22;
	var ideal_precip = 0;
	var number_of_ideal_months = 4;

	OptimalTimeInterval.findBestMonths = function(city_data) {

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

	module.exports = OptimalTimeInterval;


/***/ }
/******/ ]);