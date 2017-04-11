/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 6);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var BackendInterface = {};

var ManageMapMarkers = __webpack_require__(3);

var places_list_ref = new Firebase("https://skyline-maps.firebaseio.com/places");
BackendInterface.myFirebaseRef = new Firebase("https://skyline-maps.firebaseio.com/");

BackendInterface.getPlaces = function () {
  places_list_ref.once("value", handlePlacesDataSuccess, handlePlacesDataFail);
};

function handlePlacesDataSuccess(snapshot) {
  BackendInterface.places_list = snapshot.val();
  ManageMapMarkers.renderCities(BackendInterface.places_list);
}

function handlePlacesDataFail(errorObject) {
  console.log("The read failed: " + errorObject.code);
}

module.exports = BackendInterface;

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var InitializeMap = {};

InitializeMap.map = null;

InitializeMap.initMap = function () {

  InitializeMap.map = new google.maps.Map(document.getElementById('map'), {
    center: { lat: 20, lng: 20 },
    scrollwheel: true,
    zoom: 2,
    minZoom: 2
  });
};

module.exports = InitializeMap;

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var CurrentMonth = {};

CurrentMonth.selected_month = new Date().getMonth() + 1;

CurrentMonth.getSelectedMonth = function () {
    return CurrentMonth.selected_month;
};

CurrentMonth.setSelectedMonth = function (new_month) {
    CurrentMonth.selected_month = new_month;
};

module.exports = CurrentMonth;

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var ManageMapMarkers = {};

var BackendInterface = __webpack_require__(0);
var InitializeMap = __webpack_require__(1);
var OptimalTimeInterval = __webpack_require__(7);
var CurrentMonth = __webpack_require__(2);

var best_weather_months;
var markers = [];
var infoWindow = new google.maps.InfoWindow();

var monthAbbreviations = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

var loading_overlay = document.getElementById('loading-overlay-element');

ManageMapMarkers.renderCities = function (cities) {
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
};

function prepMarkers(lat, lng, name, high_temp, low_temp, precip_chance, best_months) {

    var latLng = {
        "lat": Number(lat),
        "lng": Number(lng)
    };
    var marker = new google.maps.Marker({
        position: latLng,
        map: InitializeMap.map,
        title: name
    });

    InitializeMap.map.addListener('click', function () {
        infoWindow.close();
    });

    marker.addListener('click', function () {
        infoWindow.close();
        var best_months_names = '';
        best_months.sort(function (a, b) {
            return a - b;
        });
        for (var i = 0; i < best_months.length; i++) {
            best_months_names += monthAbbreviations[best_months[i]] + '';
            if (i !== best_months.length - 1) {
                best_months_names += ', ';
            }
        }
        infoWindow.setContent('<div>' + '<h2>' + name + '</h2>' + '<div> Low: ' + low_temp + '&#8451;</div>' + '<div> High: ' + high_temp + '&#8451;</div>' + '<div>Precip: ' + precip_chance + '%</div>' + '<div> Best months: ' + best_months_names + '</div>');
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

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var ControlsUI = {};

var BackendInterface = __webpack_require__(0);
var ManageMapMarkers = __webpack_require__(3);
var CurrentMonth = __webpack_require__(2);

var selected_month = CurrentMonth.selected_month;

ControlsUI.initializeSelectedMonth = function () {

    if (selected_month === 11) {
        CurrentMonth.setSelectedMonth(0);
    }

    for (var i = 0; i < month_wrap.children.length; i++) {
        if (i === selected_month) {
            month_wrap.children[i].className += " selected";
            break;
        }
    }
};

ControlsUI.removeSelectedClass = function (element) {
    for (var i = 0; i < element.children.length; i++) {
        element.children[i].className = "month-button";
    }
};

var month_wrap = document.getElementById("month-wrap-id");
month_wrap.onclick = function (event) {
    var element = event.target;
    ControlsUI.removeSelectedClass(element.parentNode);
    element.className += " selected";
    CurrentMonth.setSelectedMonth(Number(element.value));
    ManageMapMarkers.renderCities(BackendInterface.places_list);
};

module.exports = ControlsUI;

/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var WeatherDataImport = {};

var BackendInterface = __webpack_require__(0);

var upload_month = 0;
var calls_number = document.getElementById("calls-number");

var pull_interval;

var WU_API_KEY = '';

WeatherDataImport.initializeImport = function () {
    var start_adding_button = document.getElementById('start-adding-button');
    start_adding_button.onclick = function () {
        pull_interval = setInterval(function () {
            addNewPlace();
        }, 10000);
    };

    getKey();
};

function addNewPlace() {
    var city_name = document.getElementById("place_name").value;
    var longitude = document.getElementById("longitude").value;
    var latitude = document.getElementById("latitude").value;

    var places_ref = BackendInterface.myFirebaseRef.child("places/" + city_name + "/" + upload_month);

    var firebase_payload = {};

    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
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
    };

    var endpoint = "http://api.wunderground.com/api/" + WU_API_KEY + "/planner_" + formatted_upload_month + filter_date.start_day + formatted_upload_month + filter_date.end_day + "/q/" + latitude + ',' + longitude + ".json";
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
    config_ref.on("value", function (snapshot) {
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
    } else {
        cleanedUpMonth = monthAsString;
    }
    return cleanedUpMonth;
}

module.exports = WeatherDataImport;

/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var InitializeMap = __webpack_require__(1);
var ControlsUI = __webpack_require__(4);
var BackendInterface = __webpack_require__(0);
var WeatherDataImport = __webpack_require__(5);

window.onload = function () {
    InitializeMap.initMap();
    BackendInterface.getPlaces();
    ControlsUI.initializeSelectedMonth();
    WeatherDataImport.initializeImport();
};

/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var OptimalTimeInterval = {};

var ideal_temp = 22;
var ideal_precip = 0;
var number_of_ideal_months = 4;

OptimalTimeInterval.findBestMonths = function (city_data) {

    var weather_scores = [];
    var ideal_months = [];

    for (var i = 0; i < city_data.length; i++) {

        var raw_precip_percentage = city_data[i].chance_of.chanceofprecip.percentage;
        var formatted_precip_percentage = Number(raw_precip_percentage);

        var raw_high_temp_avg = city_data[i].temp_high.avg['C'];
        var raw_low_temp_avg = city_data[i].temp_low.avg['C'];

        var formatted_avg_temp = (Number(raw_high_temp_avg) + Number(raw_low_temp_avg)) / 2;
        var difference_from_ideal_temp = Math.abs(ideal_temp - formatted_avg_temp);

        var weather_score_item = 0.3 * (formatted_precip_percentage / 100) + 0.7 * (difference_from_ideal_temp / 25);

        weather_scores.push({
            "score": weather_score_item,
            "month": i
        });
    }

    sortWeather(weather_scores);

    for (var i = 0; i < number_of_ideal_months; i++) {
        ideal_months.push(weather_scores[i].month);
    }
    return ideal_months;
};

function sortWeather(weather_scores) {
    weather_scores.sort(function (a, b) {
        return a.score - b.score;
    });
}

module.exports = OptimalTimeInterval;

/***/ })
/******/ ]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAgMTI3YjY0YjQyMWY2MTUzNzRkMzEiLCJ3ZWJwYWNrOi8vLy4vanMvYmFja2VuZF9pbnRlcmZhY2UuanMiLCJ3ZWJwYWNrOi8vLy4vanMvaW5pdGlhbGl6ZV9tYXAuanMiLCJ3ZWJwYWNrOi8vLy4vanMvY3VycmVudF9tb250aC5qcyIsIndlYnBhY2s6Ly8vLi9qcy9tYW5hZ2VfbWFwX21hcmtlcnMuanMiLCJ3ZWJwYWNrOi8vLy4vanMvY29udHJvbHNfdWkuanMiLCJ3ZWJwYWNrOi8vLy4vanMvd2VhdGhlcl9kYXRhX2ltcG9ydC5qcyIsIndlYnBhY2s6Ly8vLi9qcy9pbmRleC5qcyIsIndlYnBhY2s6Ly8vLi9qcy9vcHRpbWFsX3RpbWVfaW50ZXJ2YWwuanMiXSwibmFtZXMiOlsiQmFja2VuZEludGVyZmFjZSIsIk1hbmFnZU1hcE1hcmtlcnMiLCJyZXF1aXJlIiwicGxhY2VzX2xpc3RfcmVmIiwiRmlyZWJhc2UiLCJteUZpcmViYXNlUmVmIiwiZ2V0UGxhY2VzIiwib25jZSIsImhhbmRsZVBsYWNlc0RhdGFTdWNjZXNzIiwiaGFuZGxlUGxhY2VzRGF0YUZhaWwiLCJzbmFwc2hvdCIsInBsYWNlc19saXN0IiwidmFsIiwicmVuZGVyQ2l0aWVzIiwiZXJyb3JPYmplY3QiLCJjb25zb2xlIiwibG9nIiwiY29kZSIsIm1vZHVsZSIsImV4cG9ydHMiLCJJbml0aWFsaXplTWFwIiwibWFwIiwiaW5pdE1hcCIsImdvb2dsZSIsIm1hcHMiLCJNYXAiLCJkb2N1bWVudCIsImdldEVsZW1lbnRCeUlkIiwiY2VudGVyIiwibGF0IiwibG5nIiwic2Nyb2xsd2hlZWwiLCJ6b29tIiwibWluWm9vbSIsIkN1cnJlbnRNb250aCIsInNlbGVjdGVkX21vbnRoIiwiRGF0ZSIsImdldE1vbnRoIiwiZ2V0U2VsZWN0ZWRNb250aCIsInNldFNlbGVjdGVkTW9udGgiLCJuZXdfbW9udGgiLCJPcHRpbWFsVGltZUludGVydmFsIiwiYmVzdF93ZWF0aGVyX21vbnRocyIsIm1hcmtlcnMiLCJpbmZvV2luZG93IiwiSW5mb1dpbmRvdyIsIm1vbnRoQWJicmV2aWF0aW9ucyIsImxvYWRpbmdfb3ZlcmxheSIsImNpdGllcyIsImRlbGV0ZU1hcmtlcnMiLCJsYXRpdHVkZSIsImxvbmdpdHVkZSIsImtleSIsImZpbmRCZXN0TW9udGhzIiwiaW5kZXhPZiIsInByZXBNYXJrZXJzIiwidGVtcF9oaWdoIiwiYXZnIiwidGVtcF9sb3ciLCJjaGFuY2Vfb2YiLCJjaGFuY2VvZnByZWNpcCIsInBlcmNlbnRhZ2UiLCJzZXRNYXBPbkFsbCIsIm5hbWUiLCJoaWdoX3RlbXAiLCJsb3dfdGVtcCIsInByZWNpcF9jaGFuY2UiLCJiZXN0X21vbnRocyIsImxhdExuZyIsIk51bWJlciIsIm1hcmtlciIsIk1hcmtlciIsInBvc2l0aW9uIiwidGl0bGUiLCJhZGRMaXN0ZW5lciIsImNsb3NlIiwiYmVzdF9tb250aHNfbmFtZXMiLCJzb3J0IiwiYSIsImIiLCJpIiwibGVuZ3RoIiwic2V0Q29udGVudCIsIm9wZW4iLCJwdXNoIiwiY2xlYXJNYXJrZXJzIiwic2V0TWFwIiwic3R5bGUiLCJ2aXNpYmlsaXR5IiwiQ29udHJvbHNVSSIsImluaXRpYWxpemVTZWxlY3RlZE1vbnRoIiwibW9udGhfd3JhcCIsImNoaWxkcmVuIiwiY2xhc3NOYW1lIiwicmVtb3ZlU2VsZWN0ZWRDbGFzcyIsImVsZW1lbnQiLCJvbmNsaWNrIiwiZXZlbnQiLCJ0YXJnZXQiLCJwYXJlbnROb2RlIiwidmFsdWUiLCJXZWF0aGVyRGF0YUltcG9ydCIsInVwbG9hZF9tb250aCIsImNhbGxzX251bWJlciIsInB1bGxfaW50ZXJ2YWwiLCJXVV9BUElfS0VZIiwiaW5pdGlhbGl6ZUltcG9ydCIsInN0YXJ0X2FkZGluZ19idXR0b24iLCJzZXRJbnRlcnZhbCIsImFkZE5ld1BsYWNlIiwiZ2V0S2V5IiwiY2l0eV9uYW1lIiwicGxhY2VzX3JlZiIsImNoaWxkIiwiZmlyZWJhc2VfcGF5bG9hZCIsInhodHRwIiwiWE1MSHR0cFJlcXVlc3QiLCJvbnJlYWR5c3RhdGVjaGFuZ2UiLCJyZWFkeVN0YXRlIiwic3RhdHVzIiwianNvbl9yZXNwb25zZSIsIkpTT04iLCJwYXJzZSIsInJlc3BvbnNlIiwidHJpcCIsInNldCIsImZvcm1hdHRlZF91cGxvYWRfbW9udGgiLCJmb3JtYXRNb250aEZvclJlcXVlc3QiLCJmaWx0ZXJfZGF0ZSIsInN0YXJ0X2RheSIsImVuZF9kYXkiLCJlbmRwb2ludCIsInNlbmQiLCJjbGVhckludGVydmFsIiwidXBkYXRlVUlDYWxscyIsImNvbmZpZ19yZWYiLCJvbiIsImlubmVySFRNTCIsIm1vbnRoIiwibW9udGhBc051bWJlciIsImNsZWFuZWRVcE1vbnRoIiwibW9udGhBc1N0cmluZyIsInRvU3RyaW5nIiwiY29uY2F0Iiwid2luZG93Iiwib25sb2FkIiwiaWRlYWxfdGVtcCIsImlkZWFsX3ByZWNpcCIsIm51bWJlcl9vZl9pZGVhbF9tb250aHMiLCJjaXR5X2RhdGEiLCJ3ZWF0aGVyX3Njb3JlcyIsImlkZWFsX21vbnRocyIsInJhd19wcmVjaXBfcGVyY2VudGFnZSIsImZvcm1hdHRlZF9wcmVjaXBfcGVyY2VudGFnZSIsInJhd19oaWdoX3RlbXBfYXZnIiwicmF3X2xvd190ZW1wX2F2ZyIsImZvcm1hdHRlZF9hdmdfdGVtcCIsImRpZmZlcmVuY2VfZnJvbV9pZGVhbF90ZW1wIiwiTWF0aCIsImFicyIsIndlYXRoZXJfc2NvcmVfaXRlbSIsInNvcnRXZWF0aGVyIiwic2NvcmUiXSwibWFwcGluZ3MiOiI7QUFBQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOzs7QUFHQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQSxtREFBMkMsY0FBYzs7QUFFekQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFLO0FBQ0w7QUFDQTs7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RUFQLHVCQUFlbEUsSUFBZixDQUFvQjtBQUNoQixxQkFBUzRFLGtCQURPO0FBRWhCLHFCQUFTaEY7QUFGTyxTQUFwQjtBQUlIOztBQUVEaUYsZ0JBQVlYLGNBQVo7O0FBRUEsU0FBSyxJQUFJdEUsSUFBSSxDQUFiLEVBQWdCQSxJQUFJb0Usc0JBQXBCLEVBQTRDcEUsR0FBNUMsRUFBa0Q7QUFDOUN1RSxxQkFBYW5FLElBQWIsQ0FBa0JrRSxlQUFldEUsQ0FBZixFQUFrQjBELEtBQXBDO0FBQ0g7QUFDRCxXQUFPYSxZQUFQO0FBQ0gsQ0E5QkQ7O0FBZ0NBLFNBQVNVLFdBQVQsQ0FBcUJYLGNBQXJCLEVBQXFDO0FBQ2pDQSxtQkFBZXpFLElBQWYsQ0FDSSxVQUFTQyxDQUFULEVBQVlDLENBQVosRUFBZTtBQUNYLGVBQU9ELEVBQUVvRixLQUFGLEdBQVVuRixFQUFFbUYsS0FBbkI7QUFDUCxLQUhEO0FBSUg7O0FBRURoSixPQUFPQyxPQUFQLEdBQWlCc0IsbUJBQWpCLEMiLCJmaWxlIjoiYnVuZGxlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiIFx0Ly8gVGhlIG1vZHVsZSBjYWNoZVxuIFx0dmFyIGluc3RhbGxlZE1vZHVsZXMgPSB7fTtcblxuIFx0Ly8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbiBcdGZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblxuIFx0XHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcbiBcdFx0aWYoaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0pXG4gXHRcdFx0cmV0dXJuIGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdLmV4cG9ydHM7XG5cbiBcdFx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcbiBcdFx0dmFyIG1vZHVsZSA9IGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdID0ge1xuIFx0XHRcdGk6IG1vZHVsZUlkLFxuIFx0XHRcdGw6IGZhbHNlLFxuIFx0XHRcdGV4cG9ydHM6IHt9XG4gXHRcdH07XG5cbiBcdFx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG4gXHRcdG1vZHVsZXNbbW9kdWxlSWRdLmNhbGwobW9kdWxlLmV4cG9ydHMsIG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG4gXHRcdC8vIEZsYWcgdGhlIG1vZHVsZSBhcyBsb2FkZWRcbiBcdFx0bW9kdWxlLmwgPSB0cnVlO1xuXG4gXHRcdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG4gXHRcdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbiBcdH1cblxuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZXMgb2JqZWN0IChfX3dlYnBhY2tfbW9kdWxlc19fKVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5tID0gbW9kdWxlcztcblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGUgY2FjaGVcbiBcdF9fd2VicGFja19yZXF1aXJlX18uYyA9IGluc3RhbGxlZE1vZHVsZXM7XG5cbiBcdC8vIGlkZW50aXR5IGZ1bmN0aW9uIGZvciBjYWxsaW5nIGhhcm1vbnkgaW1wb3J0cyB3aXRoIHRoZSBjb3JyZWN0IGNvbnRleHRcbiBcdF9fd2VicGFja19yZXF1aXJlX18uaSA9IGZ1bmN0aW9uKHZhbHVlKSB7IHJldHVybiB2YWx1ZTsgfTtcblxuIFx0Ly8gZGVmaW5lIGdldHRlciBmdW5jdGlvbiBmb3IgaGFybW9ueSBleHBvcnRzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSBmdW5jdGlvbihleHBvcnRzLCBuYW1lLCBnZXR0ZXIpIHtcbiBcdFx0aWYoIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBuYW1lKSkge1xuIFx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBuYW1lLCB7XG4gXHRcdFx0XHRjb25maWd1cmFibGU6IGZhbHNlLFxuIFx0XHRcdFx0ZW51bWVyYWJsZTogdHJ1ZSxcbiBcdFx0XHRcdGdldDogZ2V0dGVyXG4gXHRcdFx0fSk7XG4gXHRcdH1cbiBcdH07XG5cbiBcdC8vIGdldERlZmF1bHRFeHBvcnQgZnVuY3Rpb24gZm9yIGNvbXBhdGliaWxpdHkgd2l0aCBub24taGFybW9ueSBtb2R1bGVzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm4gPSBmdW5jdGlvbihtb2R1bGUpIHtcbiBcdFx0dmFyIGdldHRlciA9IG1vZHVsZSAmJiBtb2R1bGUuX19lc01vZHVsZSA/XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0RGVmYXVsdCgpIHsgcmV0dXJuIG1vZHVsZVsnZGVmYXVsdCddOyB9IDpcbiBcdFx0XHRmdW5jdGlvbiBnZXRNb2R1bGVFeHBvcnRzKCkgeyByZXR1cm4gbW9kdWxlOyB9O1xuIFx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQoZ2V0dGVyLCAnYScsIGdldHRlcik7XG4gXHRcdHJldHVybiBnZXR0ZXI7XG4gXHR9O1xuXG4gXHQvLyBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGxcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubyA9IGZ1bmN0aW9uKG9iamVjdCwgcHJvcGVydHkpIHsgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmplY3QsIHByb3BlcnR5KTsgfTtcblxuIFx0Ly8gX193ZWJwYWNrX3B1YmxpY19wYXRoX19cbiBcdF9fd2VicGFja19yZXF1aXJlX18ucCA9IFwiXCI7XG5cbiBcdC8vIExvYWQgZW50cnkgbW9kdWxlIGFuZCByZXR1cm4gZXhwb3J0c1xuIFx0cmV0dXJuIF9fd2VicGFja19yZXF1aXJlX18oX193ZWJwYWNrX3JlcXVpcmVfXy5zID0gNik7XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gd2VicGFjay9ib290c3RyYXAgMTI3YjY0YjQyMWY2MTUzNzRkMzEiLCJ2YXIgQmFja2VuZEludGVyZmFjZSA9IHt9O1xuXG52YXIgTWFuYWdlTWFwTWFya2VycyA9IHJlcXVpcmUoJy4vbWFuYWdlX21hcF9tYXJrZXJzLmpzJyk7XG5cbnZhciBwbGFjZXNfbGlzdF9yZWYgPSBuZXcgRmlyZWJhc2UoXCJodHRwczovL3NreWxpbmUtbWFwcy5maXJlYmFzZWlvLmNvbS9wbGFjZXNcIik7XG5CYWNrZW5kSW50ZXJmYWNlLm15RmlyZWJhc2VSZWYgPSBuZXcgRmlyZWJhc2UoXCJodHRwczovL3NreWxpbmUtbWFwcy5maXJlYmFzZWlvLmNvbS9cIik7XG5cbkJhY2tlbmRJbnRlcmZhY2UuZ2V0UGxhY2VzID0gZnVuY3Rpb24oKSB7XG4gICAgcGxhY2VzX2xpc3RfcmVmLm9uY2UoXCJ2YWx1ZVwiLCBoYW5kbGVQbGFjZXNEYXRhU3VjY2VzcywgaGFuZGxlUGxhY2VzRGF0YUZhaWwpO1xufVxuXG5mdW5jdGlvbiBoYW5kbGVQbGFjZXNEYXRhU3VjY2VzcyhzbmFwc2hvdCkge1xuICBCYWNrZW5kSW50ZXJmYWNlLnBsYWNlc19saXN0ID0gc25hcHNob3QudmFsKCk7XG4gIE1hbmFnZU1hcE1hcmtlcnMucmVuZGVyQ2l0aWVzKEJhY2tlbmRJbnRlcmZhY2UucGxhY2VzX2xpc3QpO1xufVxuXG5mdW5jdGlvbiBoYW5kbGVQbGFjZXNEYXRhRmFpbChlcnJvck9iamVjdCkge1xuICBjb25zb2xlLmxvZyhcIlRoZSByZWFkIGZhaWxlZDogXCIgKyBlcnJvck9iamVjdC5jb2RlKTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBCYWNrZW5kSW50ZXJmYWNlO1xuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vanMvYmFja2VuZF9pbnRlcmZhY2UuanMiLCJ2YXIgSW5pdGlhbGl6ZU1hcCA9IHt9O1xuXG5Jbml0aWFsaXplTWFwLm1hcCA9IG51bGw7XG5cbkluaXRpYWxpemVNYXAuaW5pdE1hcCA9IGZ1bmN0aW9uKCkge1xuXG4gIEluaXRpYWxpemVNYXAubWFwID0gbmV3IGdvb2dsZS5tYXBzLk1hcChkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnbWFwJyksIHtcbiAgICBjZW50ZXI6IHtsYXQ6IDIwLCBsbmc6IDIwfSxcbiAgICBzY3JvbGx3aGVlbDogdHJ1ZSxcbiAgICB6b29tOiAyLFxuICAgIG1pblpvb206IDJcbiAgfSk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gSW5pdGlhbGl6ZU1hcDtcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL2pzL2luaXRpYWxpemVfbWFwLmpzIiwidmFyIEN1cnJlbnRNb250aCA9IHt9O1xuXG5DdXJyZW50TW9udGguc2VsZWN0ZWRfbW9udGggPSBuZXcgRGF0ZSgpLmdldE1vbnRoKCkgKyAxO1xuXG5DdXJyZW50TW9udGguZ2V0U2VsZWN0ZWRNb250aCA9IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiBDdXJyZW50TW9udGguc2VsZWN0ZWRfbW9udGg7XG59XG5cbkN1cnJlbnRNb250aC5zZXRTZWxlY3RlZE1vbnRoID0gZnVuY3Rpb24obmV3X21vbnRoKSB7XG4gICAgQ3VycmVudE1vbnRoLnNlbGVjdGVkX21vbnRoID0gbmV3X21vbnRoO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IEN1cnJlbnRNb250aDtcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL2pzL2N1cnJlbnRfbW9udGguanMiLCJ2YXIgTWFuYWdlTWFwTWFya2VycyA9IHt9O1xuXG52YXIgQmFja2VuZEludGVyZmFjZSA9IHJlcXVpcmUoJy4vYmFja2VuZF9pbnRlcmZhY2UuanMnKTtcbnZhciBJbml0aWFsaXplTWFwID0gcmVxdWlyZSgnLi9pbml0aWFsaXplX21hcC5qcycpO1xudmFyIE9wdGltYWxUaW1lSW50ZXJ2YWwgPSByZXF1aXJlKCcuL29wdGltYWxfdGltZV9pbnRlcnZhbC5qcycpO1xudmFyIEN1cnJlbnRNb250aCA9IHJlcXVpcmUoJy4vY3VycmVudF9tb250aC5qcycpO1xuXG52YXIgYmVzdF93ZWF0aGVyX21vbnRocztcbnZhciBtYXJrZXJzID0gW107XG52YXIgaW5mb1dpbmRvdyA9IG5ldyBnb29nbGUubWFwcy5JbmZvV2luZG93KCk7XG5cbnZhciBtb250aEFiYnJldmlhdGlvbnMgPSBbJ0phbicsICdGZWInLCAnTWFyJywgJ0FwcicsICdNYXknLCAnSnVuJyxcbiAgICAgICdKdWwnLCAnQXVnJywgJ1NlcCcsICdPY3QnLCAnTm92JywgJ0RlYydcbiAgICBdO1xuXG52YXIgbG9hZGluZ19vdmVybGF5ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2xvYWRpbmctb3ZlcmxheS1lbGVtZW50Jyk7XG5cbk1hbmFnZU1hcE1hcmtlcnMucmVuZGVyQ2l0aWVzID0gZnVuY3Rpb24oY2l0aWVzKSB7XG4gICAgZGVsZXRlTWFya2VycygpO1xuICAgIHZhciBsYXRpdHVkZSwgbG9uZ2l0dWRlO1xuICAgIGZvciAodmFyIGtleSBpbiBjaXRpZXMpIHtcbiAgICAgICAgYmVzdF93ZWF0aGVyX21vbnRocyA9IE9wdGltYWxUaW1lSW50ZXJ2YWwuZmluZEJlc3RNb250aHMoY2l0aWVzW2tleV0pO1xuICAgICAgICBsYXRpdHVkZSA9IGNpdGllc1trZXldWzBdLmxhdGl0dWRlO1xuICAgICAgICBsb25naXR1ZGUgPSBjaXRpZXNba2V5XVswXS5sb25naXR1ZGU7XG4gICAgICAgIHZhciBzZWxlY3RlZF9tb250aCA9IEN1cnJlbnRNb250aC5nZXRTZWxlY3RlZE1vbnRoKCk7XG4gICAgICAgIGlmIChiZXN0X3dlYXRoZXJfbW9udGhzLmluZGV4T2Yoc2VsZWN0ZWRfbW9udGgpICE9PSAtMSkge1xuICAgICAgICAgICAgcHJlcE1hcmtlcnMobGF0aXR1ZGUsIGxvbmdpdHVkZSwga2V5LCBjaXRpZXNba2V5XVtzZWxlY3RlZF9tb250aF0udGVtcF9oaWdoLmF2Z1snQyddLCBjaXRpZXNba2V5XVtzZWxlY3RlZF9tb250aF0udGVtcF9sb3cuYXZnWydDJ10sIGNpdGllc1trZXldW3NlbGVjdGVkX21vbnRoXS5jaGFuY2Vfb2YuY2hhbmNlb2ZwcmVjaXAucGVyY2VudGFnZSwgYmVzdF93ZWF0aGVyX21vbnRocyk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgc2V0TWFwT25BbGwoSW5pdGlhbGl6ZU1hcC5tYXApO1xufVxuXG5mdW5jdGlvbiBwcmVwTWFya2VycyhsYXQsIGxuZywgbmFtZSwgaGlnaF90ZW1wLCBsb3dfdGVtcCwgcHJlY2lwX2NoYW5jZSwgYmVzdF9tb250aHMpIHtcblxuICAgICAgdmFyIGxhdExuZyA9IHtcbiAgICAgICAgICBcImxhdFwiOiBOdW1iZXIobGF0KSxcbiAgICAgICAgICBcImxuZ1wiOiBOdW1iZXIobG5nKVxuICAgICAgfVxuICAgICAgdmFyIG1hcmtlciA9IG5ldyBnb29nbGUubWFwcy5NYXJrZXIoe1xuICAgICAgICBwb3NpdGlvbjogbGF0TG5nLFxuICAgICAgICBtYXA6IEluaXRpYWxpemVNYXAubWFwLFxuICAgICAgICB0aXRsZTogbmFtZVxuICAgICAgfSlcblxuICAgICAgSW5pdGlhbGl6ZU1hcC5tYXAuYWRkTGlzdGVuZXIoJ2NsaWNrJywgZnVuY3Rpb24oKXtcbiAgICAgICAgICBpbmZvV2luZG93LmNsb3NlKCk7XG4gICAgICB9KVxuXG4gICAgICBtYXJrZXIuYWRkTGlzdGVuZXIoJ2NsaWNrJywgZnVuY3Rpb24oKSB7XG4gICAgICAgIGluZm9XaW5kb3cuY2xvc2UoKTtcbiAgICAgICAgdmFyIGJlc3RfbW9udGhzX25hbWVzID0gJyc7XG4gICAgICAgIGJlc3RfbW9udGhzLnNvcnQoZnVuY3Rpb24oYSwgYikge1xuICAgICAgICAgICAgcmV0dXJuIGEgLSBiO1xuICAgICAgICB9KVxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGJlc3RfbW9udGhzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBiZXN0X21vbnRoc19uYW1lcyArPSBtb250aEFiYnJldmlhdGlvbnNbYmVzdF9tb250aHNbaV1dICsgJyc7XG4gICAgICAgICAgICBpZiAoaSAhPT0gYmVzdF9tb250aHMubGVuZ3RoIC0gMSkge1xuICAgICAgICAgICAgICAgIGJlc3RfbW9udGhzX25hbWVzICs9ICcsICdcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBpbmZvV2luZG93LnNldENvbnRlbnQoJzxkaXY+JyArXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAnPGgyPicgKyBuYW1lICtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICc8L2gyPicgK1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJzxkaXY+IExvdzogJyArIGxvd190ZW1wICtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICcmIzg0NTE7PC9kaXY+JyArXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAnPGRpdj4gSGlnaDogJyArIGhpZ2hfdGVtcCArXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAnJiM4NDUxOzwvZGl2PicgK1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJzxkaXY+UHJlY2lwOiAnICsgcHJlY2lwX2NoYW5jZSArXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAnJTwvZGl2PicgK1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJzxkaXY+IEJlc3QgbW9udGhzOiAnICsgYmVzdF9tb250aHNfbmFtZXMgK1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAnPC9kaXY+Jyk7XG4gICAgICAgIGluZm9XaW5kb3cub3BlbihJbml0aWFsaXplTWFwLm1hcCwgbWFya2VyKTtcbiAgICAgIH0pO1xuXG4gICAgICBtYXJrZXJzLnB1c2gobWFya2VyKTtcbn1cblxuZnVuY3Rpb24gZGVsZXRlTWFya2VycygpIHtcbiAgY2xlYXJNYXJrZXJzKCk7XG4gIG1hcmtlcnMgPSBbXTtcbn1cblxuZnVuY3Rpb24gY2xlYXJNYXJrZXJzKCkge1xuICBzZXRNYXBPbkFsbChudWxsKTtcbn1cblxuZnVuY3Rpb24gc2V0TWFwT25BbGwobWFwKSB7XG4gIGZvciAodmFyIGkgPSAwOyBpIDwgbWFya2Vycy5sZW5ndGg7IGkrKykge1xuICAgIG1hcmtlcnNbaV0uc2V0TWFwKG1hcCk7XG4gIH1cbiAgbG9hZGluZ19vdmVybGF5LnN0eWxlLnZpc2liaWxpdHkgPSBcImhpZGRlblwiO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IE1hbmFnZU1hcE1hcmtlcnM7XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9qcy9tYW5hZ2VfbWFwX21hcmtlcnMuanMiLCJ2YXIgQ29udHJvbHNVSSA9IHt9O1xuXG52YXIgQmFja2VuZEludGVyZmFjZSA9IHJlcXVpcmUoJy4vYmFja2VuZF9pbnRlcmZhY2UuanMnKTtcbnZhciBNYW5hZ2VNYXBNYXJrZXJzID0gcmVxdWlyZSgnLi9tYW5hZ2VfbWFwX21hcmtlcnMuanMnKTtcbnZhciBDdXJyZW50TW9udGggPSByZXF1aXJlKCcuL2N1cnJlbnRfbW9udGguanMnKTtcblxudmFyIHNlbGVjdGVkX21vbnRoID0gQ3VycmVudE1vbnRoLnNlbGVjdGVkX21vbnRoO1xuXG5Db250cm9sc1VJLmluaXRpYWxpemVTZWxlY3RlZE1vbnRoID0gZnVuY3Rpb24oKSB7XG5cbiAgICBpZiAoc2VsZWN0ZWRfbW9udGggPT09IDExKSB7XG4gICAgICAgIEN1cnJlbnRNb250aC5zZXRTZWxlY3RlZE1vbnRoKDApO1xuICAgIH1cblxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbW9udGhfd3JhcC5jaGlsZHJlbi5sZW5ndGg7IGkrKykge1xuICAgICAgICBpZiAoaSA9PT0gc2VsZWN0ZWRfbW9udGgpIHtcbiAgICAgICAgICAgIG1vbnRoX3dyYXAuY2hpbGRyZW5baV0uY2xhc3NOYW1lICs9IFwiIHNlbGVjdGVkXCI7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgIH1cbn1cblxuQ29udHJvbHNVSS5yZW1vdmVTZWxlY3RlZENsYXNzID0gZnVuY3Rpb24oZWxlbWVudCkge1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgZWxlbWVudC5jaGlsZHJlbi5sZW5ndGg7IGkrKykge1xuICAgICAgICBlbGVtZW50LmNoaWxkcmVuW2ldLmNsYXNzTmFtZSA9IFwibW9udGgtYnV0dG9uXCI7XG4gICAgfVxufVxuXG52YXIgbW9udGhfd3JhcCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwibW9udGgtd3JhcC1pZFwiKTtcbm1vbnRoX3dyYXAub25jbGljayA9IGZ1bmN0aW9uKGV2ZW50KSB7XG4gICAgdmFyIGVsZW1lbnQgPSBldmVudC50YXJnZXQ7XG4gICAgQ29udHJvbHNVSS5yZW1vdmVTZWxlY3RlZENsYXNzKGVsZW1lbnQucGFyZW50Tm9kZSk7XG4gICAgZWxlbWVudC5jbGFzc05hbWUgKz0gXCIgc2VsZWN0ZWRcIjtcbiAgICBDdXJyZW50TW9udGguc2V0U2VsZWN0ZWRNb250aChOdW1iZXIoZWxlbWVudC52YWx1ZSkpO1xuICAgIE1hbmFnZU1hcE1hcmtlcnMucmVuZGVyQ2l0aWVzKEJhY2tlbmRJbnRlcmZhY2UucGxhY2VzX2xpc3QpO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IENvbnRyb2xzVUk7XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9qcy9jb250cm9sc191aS5qcyIsInZhciBXZWF0aGVyRGF0YUltcG9ydCA9IHt9O1xuXG52YXIgQmFja2VuZEludGVyZmFjZSA9IHJlcXVpcmUoJy4vYmFja2VuZF9pbnRlcmZhY2UuanMnKTtcblxudmFyIHVwbG9hZF9tb250aCA9IDA7XG52YXIgY2FsbHNfbnVtYmVyID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJjYWxscy1udW1iZXJcIik7XG5cbnZhciBwdWxsX2ludGVydmFsO1xuXG52YXIgV1VfQVBJX0tFWSA9ICcnO1xuXG5XZWF0aGVyRGF0YUltcG9ydC5pbml0aWFsaXplSW1wb3J0ID0gZnVuY3Rpb24oKSB7XG4gICAgdmFyIHN0YXJ0X2FkZGluZ19idXR0b24gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnc3RhcnQtYWRkaW5nLWJ1dHRvbicpO1xuICAgIHN0YXJ0X2FkZGluZ19idXR0b24ub25jbGljayA9IGZ1bmN0aW9uKCkge1xuICAgICAgICBwdWxsX2ludGVydmFsID0gc2V0SW50ZXJ2YWwoZnVuY3Rpb24oKSB7IGFkZE5ld1BsYWNlKCkgfSwgMTAwMDApO1xuICAgIH1cblxuICAgIGdldEtleSgpO1xufVxuXG5mdW5jdGlvbiBhZGROZXdQbGFjZSgpIHtcbiAgICB2YXIgY2l0eV9uYW1lID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJwbGFjZV9uYW1lXCIpLnZhbHVlO1xuICAgIHZhciBsb25naXR1ZGUgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImxvbmdpdHVkZVwiKS52YWx1ZTtcbiAgICB2YXIgbGF0aXR1ZGUgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImxhdGl0dWRlXCIpLnZhbHVlO1xuXG4gICAgdmFyIHBsYWNlc19yZWYgPSBCYWNrZW5kSW50ZXJmYWNlLm15RmlyZWJhc2VSZWYuY2hpbGQoXCJwbGFjZXMvXCIgKyBjaXR5X25hbWUgKyBcIi9cIiArIHVwbG9hZF9tb250aCk7XG5cbiAgICB2YXIgZmlyZWJhc2VfcGF5bG9hZCA9IHt9O1xuXG4gICAgdmFyIHhodHRwID0gbmV3IFhNTEh0dHBSZXF1ZXN0KCk7XG4gICAgICAgIHhodHRwLm9ucmVhZHlzdGF0ZWNoYW5nZSA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgIGlmICh4aHR0cC5yZWFkeVN0YXRlID09IDQgJiYgeGh0dHAuc3RhdHVzID09IDIwMCkge1xuICAgICAgICAgICAgICB2YXIganNvbl9yZXNwb25zZSA9IEpTT04ucGFyc2UoeGh0dHAucmVzcG9uc2UpO1xuXG4gICAgICAgICAgICAgIGNvbnNvbGUubG9nKGpzb25fcmVzcG9uc2UpO1xuXG4gICAgICAgICAgICAgIGZpcmViYXNlX3BheWxvYWQgPSBqc29uX3Jlc3BvbnNlLnRyaXA7XG4gICAgICAgICAgICAgIGZpcmViYXNlX3BheWxvYWQubGF0aXR1ZGUgPSBsYXRpdHVkZTtcbiAgICAgICAgICAgICAgZmlyZWJhc2VfcGF5bG9hZC5sb25naXR1ZGUgPSBsb25naXR1ZGU7XG5cbiAgICAgICAgICAgICAgcGxhY2VzX3JlZi5zZXQoZmlyZWJhc2VfcGF5bG9hZCk7XG4gICAgICAgICAgfVxuICAgICAgICB9O1xuXG4gICAgICAgIHZhciBmb3JtYXR0ZWRfdXBsb2FkX21vbnRoID0gZm9ybWF0TW9udGhGb3JSZXF1ZXN0KHVwbG9hZF9tb250aCk7XG4gICAgICAgIHZhciBmaWx0ZXJfZGF0ZSA9IHtcbiAgICAgICAgICAgIHN0YXJ0X2RheTogJzAxJyxcbiAgICAgICAgICAgIGVuZF9kYXk6ICcyOCdcbiAgICAgICAgfVxuXG4gICAgICAgIHZhciBlbmRwb2ludCA9IFwiaHR0cDovL2FwaS53dW5kZXJncm91bmQuY29tL2FwaS9cIlxuICAgICAgICAgICAgICAgICAgICAgICAgICsgV1VfQVBJX0tFWVxuICAgICAgICAgICAgICAgICAgICAgICAgICsgXCIvcGxhbm5lcl9cIlxuICAgICAgICAgICAgICAgICAgICAgICAgICsgZm9ybWF0dGVkX3VwbG9hZF9tb250aFxuICAgICAgICAgICAgICAgICAgICAgICAgICsgZmlsdGVyX2RhdGUuc3RhcnRfZGF5XG4gICAgICAgICAgICAgICAgICAgICAgICAgKyBmb3JtYXR0ZWRfdXBsb2FkX21vbnRoXG4gICAgICAgICAgICAgICAgICAgICAgICAgKyBmaWx0ZXJfZGF0ZS5lbmRfZGF5XG4gICAgICAgICAgICAgICAgICAgICAgICAgKyBcIi9xL1wiXG4gICAgICAgICAgICAgICAgICAgICAgICAgKyBsYXRpdHVkZVxuICAgICAgICAgICAgICAgICAgICAgICAgICsgJywnXG4gICAgICAgICAgICAgICAgICAgICAgICAgKyBsb25naXR1ZGVcbiAgICAgICAgICAgICAgICAgICAgICAgICArIFwiLmpzb25cIjtcbiAgICAgICAgeGh0dHAub3BlbihcIkdFVFwiLCBlbmRwb2ludCwgdHJ1ZSk7XG4gICAgICAgIHhodHRwLnNlbmQoKTtcblxuICAgICAgICBpZiAodXBsb2FkX21vbnRoID09PSAxMSkge1xuICAgICAgICAgICAgY2xlYXJJbnRlcnZhbChwdWxsX2ludGVydmFsKTtcbiAgICAgICAgfVxuICAgICAgICArK3VwbG9hZF9tb250aDtcbiAgICAgICAgdXBkYXRlVUlDYWxscygpO1xufVxuXG5mdW5jdGlvbiBnZXRLZXkoKSB7XG4gICAgdmFyIGNvbmZpZ19yZWYgPSBCYWNrZW5kSW50ZXJmYWNlLm15RmlyZWJhc2VSZWYuY2hpbGQoXCJjb25maWcvV1VfQVBJX0tFWVwiKTtcbiAgICBjb25maWdfcmVmLm9uKFwidmFsdWVcIiwgZnVuY3Rpb24oc25hcHNob3QpIHtcbiAgICBXVV9BUElfS0VZID0gc25hcHNob3QudmFsKCk7XG4gICAgfSwgZnVuY3Rpb24gKGVycm9yT2JqZWN0KSB7XG4gICAgICBjb25zb2xlLmxvZyhcIlRoZSByZWFkIGZhaWxlZDogXCIgKyBlcnJvck9iamVjdC5jb2RlKTtcbiAgICB9KTtcbn1cblxuZnVuY3Rpb24gdXBkYXRlVUlDYWxscygpIHtcbiAgICBjYWxsc19udW1iZXIuaW5uZXJIVE1MID0gdXBsb2FkX21vbnRoO1xufTtcblxuZnVuY3Rpb24gZm9ybWF0TW9udGhGb3JSZXF1ZXN0KG1vbnRoKSB7XG4gICAgdmFyIG1vbnRoQXNOdW1iZXIgPSBOdW1iZXIobW9udGgpO1xuICAgIHZhciBjbGVhbmVkVXBNb250aCA9ICcnO1xuICAgIG1vbnRoQXNOdW1iZXIgKz0gMTtcblxuICAgIHZhciBtb250aEFzU3RyaW5nID0gbW9udGhBc051bWJlci50b1N0cmluZygpO1xuICAgIGlmIChtb250aEFzU3RyaW5nLmxlbmd0aCA9PT0gMSkge1xuICAgICAgICBjbGVhbmVkVXBNb250aCA9ICcwJy5jb25jYXQobW9udGhBc1N0cmluZyk7XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgICBjbGVhbmVkVXBNb250aCA9IG1vbnRoQXNTdHJpbmc7XG4gICAgfVxuICAgIHJldHVybiBjbGVhbmVkVXBNb250aDtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBXZWF0aGVyRGF0YUltcG9ydDtcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL2pzL3dlYXRoZXJfZGF0YV9pbXBvcnQuanMiLCIndXNlIHN0cmljdCc7XG5cbnZhciBJbml0aWFsaXplTWFwID0gcmVxdWlyZSgnLi9pbml0aWFsaXplX21hcC5qcycpO1xudmFyIENvbnRyb2xzVUkgPSByZXF1aXJlKCcuL2NvbnRyb2xzX3VpLmpzJyk7XG52YXIgQmFja2VuZEludGVyZmFjZSA9IHJlcXVpcmUoJy4vYmFja2VuZF9pbnRlcmZhY2UuanMnKTtcbnZhciBXZWF0aGVyRGF0YUltcG9ydCA9IHJlcXVpcmUoJy4vd2VhdGhlcl9kYXRhX2ltcG9ydC5qcycpO1xuXG53aW5kb3cub25sb2FkID0gZnVuY3Rpb24oKSB7XG4gICAgSW5pdGlhbGl6ZU1hcC5pbml0TWFwKCk7XG4gICAgQmFja2VuZEludGVyZmFjZS5nZXRQbGFjZXMoKTtcbiAgICBDb250cm9sc1VJLmluaXRpYWxpemVTZWxlY3RlZE1vbnRoKCk7XG4gICAgV2VhdGhlckRhdGFJbXBvcnQuaW5pdGlhbGl6ZUltcG9ydCgpO1xufVxuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vanMvaW5kZXguanMiLCJ2YXIgT3B0aW1hbFRpbWVJbnRlcnZhbCA9IHt9O1xuXG52YXIgaWRlYWxfdGVtcCA9IDIyO1xudmFyIGlkZWFsX3ByZWNpcCA9IDA7XG52YXIgbnVtYmVyX29mX2lkZWFsX21vbnRocyA9IDQ7XG5cbk9wdGltYWxUaW1lSW50ZXJ2YWwuZmluZEJlc3RNb250aHMgPSBmdW5jdGlvbihjaXR5X2RhdGEpIHtcblxuICAgIHZhciB3ZWF0aGVyX3Njb3JlcyA9IFtdO1xuICAgIHZhciBpZGVhbF9tb250aHMgPSBbXTtcblxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgY2l0eV9kYXRhLmxlbmd0aDsgaSsrKSB7XG5cbiAgICAgICAgdmFyIHJhd19wcmVjaXBfcGVyY2VudGFnZSA9IGNpdHlfZGF0YVtpXS5jaGFuY2Vfb2YuY2hhbmNlb2ZwcmVjaXAucGVyY2VudGFnZTtcbiAgICAgICAgdmFyIGZvcm1hdHRlZF9wcmVjaXBfcGVyY2VudGFnZSA9IE51bWJlcihyYXdfcHJlY2lwX3BlcmNlbnRhZ2UpO1xuXG4gICAgICAgIHZhciByYXdfaGlnaF90ZW1wX2F2ZyA9IGNpdHlfZGF0YVtpXS50ZW1wX2hpZ2guYXZnWydDJ107XG4gICAgICAgIHZhciByYXdfbG93X3RlbXBfYXZnID0gY2l0eV9kYXRhW2ldLnRlbXBfbG93LmF2Z1snQyddO1xuXG4gICAgICAgIHZhciBmb3JtYXR0ZWRfYXZnX3RlbXAgPSAoTnVtYmVyKHJhd19oaWdoX3RlbXBfYXZnKSArIE51bWJlcihyYXdfbG93X3RlbXBfYXZnKSkvMjtcbiAgICAgICAgdmFyIGRpZmZlcmVuY2VfZnJvbV9pZGVhbF90ZW1wID0gTWF0aC5hYnMoaWRlYWxfdGVtcCAtIGZvcm1hdHRlZF9hdmdfdGVtcCk7XG5cbiAgICAgICAgdmFyIHdlYXRoZXJfc2NvcmVfaXRlbSA9IDAuMyAqIChmb3JtYXR0ZWRfcHJlY2lwX3BlcmNlbnRhZ2UgLyAxMDApICsgMC43ICogKGRpZmZlcmVuY2VfZnJvbV9pZGVhbF90ZW1wIC8gMjUpO1xuXG4gICAgICAgIHdlYXRoZXJfc2NvcmVzLnB1c2goe1xuICAgICAgICAgICAgXCJzY29yZVwiOiB3ZWF0aGVyX3Njb3JlX2l0ZW0sXG4gICAgICAgICAgICBcIm1vbnRoXCI6IGlcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgc29ydFdlYXRoZXIod2VhdGhlcl9zY29yZXMpO1xuXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBudW1iZXJfb2ZfaWRlYWxfbW9udGhzOyBpKysgKSB7XG4gICAgICAgIGlkZWFsX21vbnRocy5wdXNoKHdlYXRoZXJfc2NvcmVzW2ldLm1vbnRoKTtcbiAgICB9XG4gICAgcmV0dXJuIGlkZWFsX21vbnRocztcbn1cblxuZnVuY3Rpb24gc29ydFdlYXRoZXIod2VhdGhlcl9zY29yZXMpIHtcbiAgICB3ZWF0aGVyX3Njb3Jlcy5zb3J0KFxuICAgICAgICBmdW5jdGlvbihhLCBiKSB7XG4gICAgICAgICAgICByZXR1cm4gYS5zY29yZSAtIGIuc2NvcmVcbiAgICB9KTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBPcHRpbWFsVGltZUludGVydmFsO1xuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vanMvb3B0aW1hbF90aW1lX2ludGVydmFsLmpzIl0sInNvdXJjZVJvb3QiOiIifQ==