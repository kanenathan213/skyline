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
	__webpack_require__(7);
	__webpack_require__(4);
	__webpack_require__(8);

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

	var places_list_ref = new Firebase("https://skyline-maps.firebaseio.com/places");

	BackendInterface.myFirebaseRef = new Firebase("https://skyline-maps.firebaseio.com/");

	BackendInterface.places_list = {};
	var best_weather_months = [];

	places_list_ref.on("value", function(snapshot) {
	  BackendInterface.places_list = snapshot.val();
	  ManageMapMarkers.renderCities(BackendInterface.places_list);

	}, function (errorObject) {
	  console.log("The read failed: " + errorObject.code);
	});

	module.exports = BackendInterface;


/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	var ManageMapMarkers = {};

	var BackendInterface = __webpack_require__(4);
	var InitializeMap = __webpack_require__(3);
	var OptimalTimeInterval = __webpack_require__(6);
	var CurrentMonth = __webpack_require__(9);

	var best_weather_months;
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
	        title: name
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
	        best_weather_months = OptimalTimeInterval.findBestMonths(cities[key]);
	        latitude = cities[key][0].latitude;
	        longitude = cities[key][0].longitude;
	        var selected_month = CurrentMonth.getSelectedMonth();
	        if (best_weather_months.indexOf(selected_month) !== -1) {
	            prepMarkers(latitude, longitude, key);
	        }
	    }
	    setMapOnAll(InitializeMap.map);
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

	    var weather_scores = [];
	    var ideal_months = [];

	    for (var i = 0; i < city_data.length; i++) {

	        var raw_precip_percentage = city_data[i].chance_of.chanceofprecip.percentage;
	        var formatted_precip_percentage = Number(raw_precip_percentage);

	        var raw_high_temp_avg = city_data[i].temp_high.avg['C'];
	        var raw_low_temp_avg = city_data[i].temp_low.avg['C'];

	        var formatted_avg_temp = (Number(raw_high_temp_avg) + Number(raw_low_temp_avg))/2;
	        var difference_from_ideal_temp = Math.abs(ideal_temp - formatted_avg_temp);

	        var weather_score_item = 0.3 * (formatted_precip_percentage / 100) + 0.7 * (difference_from_ideal_temp / 25);

	        weather_scores.push({
	            "score": weather_score_item,
	            "month": i
	        });
	    }

	    weather_scores.sort(
	        function(a, b) {
	            return a.score - b.score
	    });

	    for (var i = 0; i < number_of_ideal_months; i++ ) {
	        ideal_months.push(weather_scores[i].month);
	    }
	    return ideal_months;
	}

	module.exports = OptimalTimeInterval;


/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	var ControlsUI = {};

	var BackendInterface = __webpack_require__(4);
	var ManageMapMarkers = __webpack_require__(5);
	var CurrentMonth = __webpack_require__(9);

	var selected_month = CurrentMonth.selected_month;

	var month_wrap = document.getElementById("month-wrap-id");

	month_wrap.onclick = function(event) {
	    var element = event.target;
	    ControlsUI.removeSelectedClass(element.parentNode);
	    element.className += " selected";
	    CurrentMonth.setSelectedMonth(Number(element.value));
	    ManageMapMarkers.renderCities(BackendInterface.places_list);
	}

	ControlsUI.initializeSelectedMonth = function() {

	    if (selected_month === 11) {
	        CurrentMonth.setSelectedMonth(0);
	    }

	    for (var i = 0; i < month_wrap.children.length; i++) {
	        if (i === selected_month) {
	            month_wrap.children[i].className += " selected";
	            break;
	        }
	    }
	}

	ControlsUI.removeSelectedClass = function(element) {
	    for (var i = 0; i < element.children.length; i++) {
	        element.children[i].className = "month-button";
	    }
	}

	ControlsUI.initializeSelectedMonth();

	module.exports = ControlsUI;


/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	var WeatherDataImport = {};

	var BackendInterface = __webpack_require__(4);

	var WU_API_KEY = '';
	var config_ref = BackendInterface.myFirebaseRef.child("config/WU_API_KEY");
	var upload_month = 0;
	var calls_number = document.getElementById("calls-number");
	var pull_interval;

	var start_adding_button = document.getElementById('start-adding-button');

	function updateUICalls() {
	    calls_number.innerHTML = upload_month;
	};

	config_ref.on("value", function(snapshot) {
	  WU_API_KEY = snapshot.val();
	}, function (errorObject) {
	  console.log("The read failed: " + errorObject.code);
	});

	// Private stuff
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

	start_adding_button.onclick = function() {
	    pull_interval = setInterval(function() { addNewPlace() }, 10000);
	}

	function addNewPlace() {
	    var city_name = document.getElementById("place_name").value;
	    var longitude = document.getElementById("longitude").value;
	    var latitude = document.getElementById("latitude").value;

	    var places_ref = BackendInterface.myFirebaseRef.child("places/" + city_name + "/" + upload_month);

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

	        var formatted_upload_month = formatMonthForRequest(upload_month);

	        var filter_date = {
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

	        if (upload_month === 11) {
	            clearInterval(pull_interval);
	        }

	        ++upload_month;
	        updateUICalls();
	}

	module.exports = WeatherDataImport;


/***/ },
/* 9 */
/***/ function(module, exports) {

	var CurrentMonth = {};

	CurrentMonth.selected_month = new Date().getMonth() + 1;

	CurrentMonth.getSelectedMonth = function() {
	    return CurrentMonth.selected_month;
	}

	CurrentMonth.setSelectedMonth = function(new_month) {
	    CurrentMonth.selected_month = new_month;
	}

	module.exports = CurrentMonth;


/***/ }
/******/ ]);