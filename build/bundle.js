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
	var ControlsUI = __webpack_require__(7);
	var BackendInterface = __webpack_require__(4);
	var WeatherDataImport = __webpack_require__(8);

	window.onload = function() {
	    InitializeMap.initMap();
	    BackendInterface.getPlaces();
	    ControlsUI.initializeSelectedMonth();
	    WeatherDataImport.initializeImport();
	}


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

	BackendInterface.getPlaces = function() {
	    places_list_ref.once("value", handlePlacesDataSuccess, handlePlacesDataFail);
	}

	function handlePlacesDataSuccess(snapshot) {
	  BackendInterface.places_list = snapshot.val();
	  ManageMapMarkers.renderCities(BackendInterface.places_list);
	}

	function handlePlacesDataFail(errorObject) {
	  console.log("The read failed: " + errorObject.code);
	}

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
	var infoWindow = new google.maps.InfoWindow();

	var monthAbbreviations = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
	      'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
	    ];

	var loading_overlay = document.getElementById('loading-overlay-element');

	ManageMapMarkers.renderCities = function(cities) {
	    deleteMarkers();
	    var latitude, longitude;
	    for (var key in cities) {
	        best_weather_months = OptimalTimeInterval.findBestMonths(cities[key]);
	        latitude = cities[key][0].latitude;
	        longitude = cities[key][0].longitude;
	        var selected_month = CurrentMonth.getSelectedMonth();
	        if (best_weather_months.indexOf(selected_month) !== -1) {
	            prepMarkers(latitude, longitude, key, cities[key][selected_month].temp_high.avg['C'], cities[key][selected_month].temp_low.avg['C'], cities[key][selected_month].chance_of.chanceofprecip.percentage, best_weather_months);
	        }
	    }
	    setMapOnAll(InitializeMap.map);
	}

	function prepMarkers(lat, lng, name, high_temp, low_temp, precip_chance, best_months) {

	      var latLng = {
	          "lat": Number(lat),
	          "lng": Number(lng)
	      }
	      var marker = new google.maps.Marker({
	        position: latLng,
	        map: InitializeMap.map,
	        title: name
	      })

	      InitializeMap.map.addListener('click', function(){
	          infoWindow.close();
	      })

	      marker.addListener('click', function() {
	        infoWindow.close();
	        var best_months_names = '';
	        best_months.sort(function(a, b) {
	            return a - b;
	        })
	        for (var i = 0; i < best_months.length; i++) {
	            best_months_names += monthAbbreviations[best_months[i]] + '';
	            if (i !== best_months.length - 1) {
	                best_months_names += ', '
	            }
	        }
	        infoWindow.setContent('<div>' +
	                                    '<h2>' + name +
	                                    '</h2>' +
	                                    '<div> Low: ' + low_temp +
	                                    '&#8451;</div>' +
	                                    '<div> High: ' + high_temp +
	                                    '&#8451;</div>' +
	                                    '<div>Precip: ' + precip_chance +
	                                    '%</div>' +
	                                    '<div> Best months: ' + best_months_names +
	                                '</div>');
	        infoWindow.open(InitializeMap.map, marker);
	      });

	      markers.push(marker);
	}

	function deleteMarkers() {
	  clearMarkers();
	  markers = [];
	}

	function clearMarkers() {
	  setMapOnAll(null);
	}

	function setMapOnAll(map) {
	  for (var i = 0; i < markers.length; i++) {
	    markers[i].setMap(map);
	  }
	  loading_overlay.style.visibility = "hidden";
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

	    sortWeather(weather_scores);

	    for (var i = 0; i < number_of_ideal_months; i++ ) {
	        ideal_months.push(weather_scores[i].month);
	    }
	    return ideal_months;
	}

	function sortWeather(weather_scores) {
	    weather_scores.sort(
	        function(a, b) {
	            return a.score - b.score
	    });
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

	var month_wrap = document.getElementById("month-wrap-id");
	month_wrap.onclick = function(event) {
	    var element = event.target;
	    ControlsUI.removeSelectedClass(element.parentNode);
	    element.className += " selected";
	    CurrentMonth.setSelectedMonth(Number(element.value));
	    ManageMapMarkers.renderCities(BackendInterface.places_list);
	}

	module.exports = ControlsUI;


/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	var WeatherDataImport = {};

	var BackendInterface = __webpack_require__(4);

	var upload_month = 0;
	var calls_number = document.getElementById("calls-number");

	var pull_interval;

	var WU_API_KEY = '';

	WeatherDataImport.initializeImport = function() {
	    var start_adding_button = document.getElementById('start-adding-button');
	    start_adding_button.onclick = function() {
	        pull_interval = setInterval(function() { addNewPlace() }, 10000);
	    }

	    getKey();
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

	              console.log(json_response);

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

	function getKey() {
	    var config_ref = BackendInterface.myFirebaseRef.child("config/WU_API_KEY");
	    config_ref.on("value", function(snapshot) {
	    WU_API_KEY = snapshot.val();
	    }, function (errorObject) {
	      console.log("The read failed: " + errorObject.code);
	    });
	}

	function updateUICalls() {
	    calls_number.innerHTML = upload_month;
	};

	function formatMonthForRequest(month) {
	    var monthAsNumber = Number(month);
	    var cleanedUpMonth = '';
	    monthAsNumber += 1;

	    var monthAsString = monthAsNumber.toString();
	    if (monthAsString.length === 1) {
	        cleanedUpMonth = '0'.concat(monthAsString);
	    }
	    else {
	        cleanedUpMonth = monthAsString;
	    }
	    return cleanedUpMonth;
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