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
BackendInterface.mainResource = new Firebase("https://skyline-maps.firebaseio.com/");

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

CurrentMonth.selectedMonth = new Date().getMonth() + 1;

CurrentMonth.getSelectedMonth = function () {
  return CurrentMonth.selectedMonth;
};

CurrentMonth.setSelectedMonth = function (newMonth) {
  CurrentMonth.selectedMonth = newMonth;
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

var selectedMonth = CurrentMonth.selectedMonth;

ControlsUI.initializeSelectedMonth = function () {
    if (selectedMonth === 11) {
        CurrentMonth.setSelectedMonth(0);
    }

    for (var i = 0; i < month_wrap.children.length; i++) {
        if (i === selectedMonth) {
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

    var places_ref = BackendInterface.mainResource.child("places/" + city_name + "/" + upload_month);

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
    var config_ref = BackendInterface.mainResource.child("config/WU_API_KEY");
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAgZTI4MTZmMTAzYzEyNGQwZGE5YjEiLCJ3ZWJwYWNrOi8vLy4vanMvYmFja2VuZC1pbnRlcmZhY2UuanMiLCJ3ZWJwYWNrOi8vLy4vanMvaW5pdGlhbGl6ZS1tYXAuanMiLCJ3ZWJwYWNrOi8vLy4vanMvY3VycmVudC1tb250aC5qcyIsIndlYnBhY2s6Ly8vLi9qcy9tYW5hZ2UtbWFwLW1hcmtlcnMuanMiLCJ3ZWJwYWNrOi8vLy4vanMvY29udHJvbHMtdWkuanMiLCJ3ZWJwYWNrOi8vLy4vanMvd2VhdGhlci1kYXRhLWltcG9ydC5qcyIsIndlYnBhY2s6Ly8vLi9qcy9pbmRleC5qcyIsIndlYnBhY2s6Ly8vLi9qcy9vcHRpbWFsLXRpbWUtaW50ZXJ2YWwuanMiXSwibmFtZXMiOlsiQmFja2VuZEludGVyZmFjZSIsIk1hbmFnZU1hcE1hcmtlcnMiLCJyZXF1aXJlIiwicGxhY2VzX2xpc3RfcmVmIiwiRmlyZWJhc2UiLCJteUZpcmViYXNlUmVmIiwiZ2V0UGxhY2VzIiwib25jZSIsImhhbmRsZVBsYWNlc0RhdGFTdWNjZXNzIiwiaGFuZGxlUGxhY2VzRGF0YUZhaWwiLCJzbmFwc2hvdCIsInBsYWNlc19saXN0IiwidmFsIiwicmVuZGVyQ2l0aWVzIiwiZXJyb3JPYmplY3QiLCJjb25zb2xlIiwibG9nIiwiY29kZSIsIm1vZHVsZSIsImV4cG9ydHMiLCJJbml0aWFsaXplTWFwIiwibWFwIiwiaW5pdE1hcCIsImdvb2dsZSIsIm1hcHMiLCJNYXAiLCJkb2N1bWVudCIsImdldEVsZW1lbnRCeUlkIiwiY2VudGVyIiwibGF0IiwibG5nIiwic2Nyb2xsd2hlZWwiLCJ6b29tIiwibWluWm9vbSIsIkN1cnJlbnRNb250aCIsInNlbGVjdGVkTW9udGgiLCJEYXRlIiwiZ2V0TW9udGgiLCJnZXRTZWxlY3RlZE1vbnRoIiwic2V0U2VsZWN0ZWRNb250aCIsIm5ld01vbnRoIiwiT3B0aW1hbFRpbWVJbnRlcnZhbCIsImJlc3Rfd2VhdGhlcl9tb250aHMiLCJtYXJrZXJzIiwiaW5mb1dpbmRvdyIsIkluZm9XaW5kb3ciLCJtb250aEFiYnJldmlhdGlvbnMiLCJsb2FkaW5nX292ZXJsYXkiLCJjaXRpZXMiLCJkZWxldGVNYXJrZXJzIiwibGF0aXR1ZGUiLCJsb25naXR1ZGUiLCJrZXkiLCJmaW5kQmVzdE1vbnRocyIsInNlbGVjdGVkX21vbnRoIiwiaW5kZXhPZiIsInByZXBNYXJrZXJzIiwidGVtcF9oaWdoIiwiYXZnIiwidGVtcF9sb3ciLCJjaGFuY2Vfb2YiLCJjaGFuY2VvZnByZWNpcCIsInBlcmNlbnRhZ2UiLCJzZXRNYXBPbkFsbCIsIm5hbWUiLCJoaWdoX3RlbXAiLCJsb3dfdGVtcCIsInByZWNpcF9jaGFuY2UiLCJiZXN0X21vbnRocyIsImxhdExuZyIsIk51bWJlciIsIm1hcmtlciIsIk1hcmtlciIsInBvc2l0aW9uIiwidGl0bGUiLCJhZGRMaXN0ZW5lciIsImNsb3NlIiwiYmVzdF9tb250aHNfbmFtZXMiLCJzb3J0IiwiYSIsImIiLCJpIiwibGVuZ3RoIiwic2V0Q29udGVudCIsIm9wZW4iLCJwdXNoIiwiY2xlYXJNYXJrZXJzIiwic2V0TWFwIiwic3R5bGUiLCJ2aXNpYmlsaXR5IiwiQ29udHJvbHNVSSIsImluaXRpYWxpemVTZWxlY3RlZE1vbnRoIiwibW9udGhfd3JhcCIsImNoaWxkcmVuIiwiY2xhc3NOYW1lIiwicmVtb3ZlU2VsZWN0ZWRDbGFzcyIsImVsZW1lbnQiLCJvbmNsaWNrIiwiZXZlbnQiLCJ0YXJnZXQiLCJwYXJlbnROb2RlIiwidmFsdWUiLCJXZWF0aGVyRGF0YUltcG9ydCIsInVwbG9hZF9tb250aCIsImNhbGxzX251bWJlciIsInB1bGxfaW50ZXJ2YWwiLCJXVV9BUElfS0VZIiwiaW5pdGlhbGl6ZUltcG9ydCIsInN0YXJ0X2FkZGluZ19idXR0b24iLCJzZXRJbnRlcnZhbCIsImFkZE5ld1BsYWNlIiwiZ2V0S2V5IiwiY2l0eV9uYW1lIiwicGxhY2VzX3JlZiIsImNoaWxkIiwiZmlyZWJhc2VfcGF5bG9hZCIsInhodHRwIiwiWE1MSHR0cFJlcXVlc3QiLCJvbnJlYWR5c3RhdGVjaGFuZ2UiLCJyZWFkeVN0YXRlIiwic3RhdHVzIiwianNvbl9yZXNwb25zZSIsIkpTT04iLCJwYXJzZSIsInJlc3BvbnNlIiwidHJpcCIsInNldCIsImZvcm1hdHRlZF91cGxvYWRfbW9udGgiLCJmb3JtYXRNb250aEZvclJlcXVlc3QiLCJmaWx0ZXJfZGF0ZSIsInN0YXJ0X2RheSIsImVuZF9kYXkiLCJlbmRwb2ludCIsInNlbmQiLCJjbGVhckludGVydmFsIiwidXBkYXRlVUlDYWxscyIsImNvbmZpZ19yZWYiLCJvbiIsImlubmVySFRNTCIsIm1vbnRoIiwibW9udGhBc051bWJlciIsImNsZWFuZWRVcE1vbnRoIiwibW9udGhBc1N0cmluZyIsInRvU3RyaW5nIiwiY29uY2F0Iiwid2luZG93Iiwib25sb2FkIiwiaWRlYWxfdGVtcCIsImlkZWFsX3ByZWNpcCIsIm51bWJlcl9vZl9pZGVhbF9tb250aHMiLCJjaXR5X2RhdGEiLCJ3ZWF0aGVyX3Njb3JlcyIsImlkZWFsX21vbnRocyIsInJhd19wcmVjaXBfcGVyY2VudGFnZSIsImZvcm1hdHRlZF9wcmVjaXBfcGVyY2VudGFnZSIsInJhd19oaWdoX3RlbXBfYXZnIiwicmF3X2xvd190ZW1wX2F2ZyIsImZvcm1hdHRlZF9hdmdfdGVtcCIsImRpZmZlcmVuY2VfZnJvbV9pZGVhbF90ZW1wIiwiTWF0aCIsImFicyIsIndlYXRoZXJfc2NvcmVfaXRlbSIsInNvcnRXZWF0aGVyIiwic2NvcmUiXSwibWFwcGluZ3MiOiI7QUFBQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOzs7QUFHQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQSxtREFBMkMsY0FBYzs7QUFFekQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxh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dUJBQWVsRSxJQUFmLENBQW9CO0FBQ2hCLHFCQUFTNEUsa0JBRE87QUFFaEIscUJBQVNoRjtBQUZPLFNBQXBCO0FBSUg7O0FBRURpRixnQkFBWVgsY0FBWjs7QUFFQSxTQUFLLElBQUl0RSxJQUFJLENBQWIsRUFBZ0JBLElBQUlvRSxzQkFBcEIsRUFBNENwRSxHQUE1QyxFQUFrRDtBQUM5Q3VFLHFCQUFhbkUsSUFBYixDQUFrQmtFLGVBQWV0RSxDQUFmLEVBQWtCMEQsS0FBcEM7QUFDSDtBQUNELFdBQU9hLFlBQVA7QUFDSCxDQTlCRDs7QUFnQ0EsU0FBU1UsV0FBVCxDQUFxQlgsY0FBckIsRUFBcUM7QUFDakNBLG1CQUFlekUsSUFBZixDQUNJLFVBQVNDLENBQVQsRUFBWUMsQ0FBWixFQUFlO0FBQ1gsZUFBT0QsRUFBRW9GLEtBQUYsR0FBVW5GLEVBQUVtRixLQUFuQjtBQUNQLEtBSEQ7QUFJSDs7QUFFRGpKLE9BQU9DLE9BQVAsR0FBaUJzQixtQkFBakIsQyIsImZpbGUiOiJidW5kbGUuanMiLCJzb3VyY2VzQ29udGVudCI6WyIgXHQvLyBUaGUgbW9kdWxlIGNhY2hlXG4gXHR2YXIgaW5zdGFsbGVkTW9kdWxlcyA9IHt9O1xuXG4gXHQvLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuIFx0ZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXG4gXHRcdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuIFx0XHRpZihpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSlcbiBcdFx0XHRyZXR1cm4gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0uZXhwb3J0cztcblxuIFx0XHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuIFx0XHR2YXIgbW9kdWxlID0gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0gPSB7XG4gXHRcdFx0aTogbW9kdWxlSWQsXG4gXHRcdFx0bDogZmFsc2UsXG4gXHRcdFx0ZXhwb3J0czoge31cbiBcdFx0fTtcblxuIFx0XHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cbiBcdFx0bW9kdWxlc1ttb2R1bGVJZF0uY2FsbChtb2R1bGUuZXhwb3J0cywgbW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cbiBcdFx0Ly8gRmxhZyB0aGUgbW9kdWxlIGFzIGxvYWRlZFxuIFx0XHRtb2R1bGUubCA9IHRydWU7XG5cbiBcdFx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcbiBcdFx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xuIFx0fVxuXG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlcyBvYmplY3QgKF9fd2VicGFja19tb2R1bGVzX18pXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm0gPSBtb2R1bGVzO1xuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZSBjYWNoZVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5jID0gaW5zdGFsbGVkTW9kdWxlcztcblxuIFx0Ly8gaWRlbnRpdHkgZnVuY3Rpb24gZm9yIGNhbGxpbmcgaGFybW9ueSBpbXBvcnRzIHdpdGggdGhlIGNvcnJlY3QgY29udGV4dFxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5pID0gZnVuY3Rpb24odmFsdWUpIHsgcmV0dXJuIHZhbHVlOyB9O1xuXG4gXHQvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9uIGZvciBoYXJtb255IGV4cG9ydHNcbiBcdF9fd2VicGFja19yZXF1aXJlX18uZCA9IGZ1bmN0aW9uKGV4cG9ydHMsIG5hbWUsIGdldHRlcikge1xuIFx0XHRpZighX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIG5hbWUpKSB7XG4gXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIG5hbWUsIHtcbiBcdFx0XHRcdGNvbmZpZ3VyYWJsZTogZmFsc2UsXG4gXHRcdFx0XHRlbnVtZXJhYmxlOiB0cnVlLFxuIFx0XHRcdFx0Z2V0OiBnZXR0ZXJcbiBcdFx0XHR9KTtcbiBcdFx0fVxuIFx0fTtcblxuIFx0Ly8gZ2V0RGVmYXVsdEV4cG9ydCBmdW5jdGlvbiBmb3IgY29tcGF0aWJpbGl0eSB3aXRoIG5vbi1oYXJtb255IG1vZHVsZXNcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubiA9IGZ1bmN0aW9uKG1vZHVsZSkge1xuIFx0XHR2YXIgZ2V0dGVyID0gbW9kdWxlICYmIG1vZHVsZS5fX2VzTW9kdWxlID9cbiBcdFx0XHRmdW5jdGlvbiBnZXREZWZhdWx0KCkgeyByZXR1cm4gbW9kdWxlWydkZWZhdWx0J107IH0gOlxuIFx0XHRcdGZ1bmN0aW9uIGdldE1vZHVsZUV4cG9ydHMoKSB7IHJldHVybiBtb2R1bGU7IH07XG4gXHRcdF9fd2VicGFja19yZXF1aXJlX18uZChnZXR0ZXIsICdhJywgZ2V0dGVyKTtcbiBcdFx0cmV0dXJuIGdldHRlcjtcbiBcdH07XG5cbiBcdC8vIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbFxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5vID0gZnVuY3Rpb24ob2JqZWN0LCBwcm9wZXJ0eSkgeyByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iamVjdCwgcHJvcGVydHkpOyB9O1xuXG4gXHQvLyBfX3dlYnBhY2tfcHVibGljX3BhdGhfX1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5wID0gXCJcIjtcblxuIFx0Ly8gTG9hZCBlbnRyeSBtb2R1bGUgYW5kIHJldHVybiBleHBvcnRzXG4gXHRyZXR1cm4gX193ZWJwYWNrX3JlcXVpcmVfXyhfX3dlYnBhY2tfcmVxdWlyZV9fLnMgPSA2KTtcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyB3ZWJwYWNrL2Jvb3RzdHJhcCBlMjgxNmYxMDNjMTI0ZDBkYTliMSIsInZhciBCYWNrZW5kSW50ZXJmYWNlID0ge307XG5cbnZhciBNYW5hZ2VNYXBNYXJrZXJzID0gcmVxdWlyZSgnLi9tYW5hZ2UtbWFwLW1hcmtlcnMuanMnKTtcblxudmFyIHBsYWNlc19saXN0X3JlZiA9IG5ldyBGaXJlYmFzZShcImh0dHBzOi8vc2t5bGluZS1tYXBzLmZpcmViYXNlaW8uY29tL3BsYWNlc1wiKTtcbkJhY2tlbmRJbnRlcmZhY2UubXlGaXJlYmFzZVJlZiA9IG5ldyBGaXJlYmFzZShcImh0dHBzOi8vc2t5bGluZS1tYXBzLmZpcmViYXNlaW8uY29tL1wiKTtcblxuQmFja2VuZEludGVyZmFjZS5nZXRQbGFjZXMgPSBmdW5jdGlvbigpIHtcbiAgICBwbGFjZXNfbGlzdF9yZWYub25jZShcInZhbHVlXCIsIGhhbmRsZVBsYWNlc0RhdGFTdWNjZXNzLCBoYW5kbGVQbGFjZXNEYXRhRmFpbCk7XG59XG5cbmZ1bmN0aW9uIGhhbmRsZVBsYWNlc0RhdGFTdWNjZXNzKHNuYXBzaG90KSB7XG4gIEJhY2tlbmRJbnRlcmZhY2UucGxhY2VzX2xpc3QgPSBzbmFwc2hvdC52YWwoKTtcbiAgTWFuYWdlTWFwTWFya2Vycy5yZW5kZXJDaXRpZXMoQmFja2VuZEludGVyZmFjZS5wbGFjZXNfbGlzdCk7XG59XG5cbmZ1bmN0aW9uIGhhbmRsZVBsYWNlc0RhdGFGYWlsKGVycm9yT2JqZWN0KSB7XG4gIGNvbnNvbGUubG9nKFwiVGhlIHJlYWQgZmFpbGVkOiBcIiArIGVycm9yT2JqZWN0LmNvZGUpO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IEJhY2tlbmRJbnRlcmZhY2U7XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9qcy9iYWNrZW5kLWludGVyZmFjZS5qcyIsInZhciBJbml0aWFsaXplTWFwID0ge307XG5cbkluaXRpYWxpemVNYXAubWFwID0gbnVsbDtcblxuSW5pdGlhbGl6ZU1hcC5pbml0TWFwID0gZnVuY3Rpb24oKSB7XG5cbiAgSW5pdGlhbGl6ZU1hcC5tYXAgPSBuZXcgZ29vZ2xlLm1hcHMuTWFwKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdtYXAnKSwge1xuICAgIGNlbnRlcjoge2xhdDogMjAsIGxuZzogMjB9LFxuICAgIHNjcm9sbHdoZWVsOiB0cnVlLFxuICAgIHpvb206IDIsXG4gICAgbWluWm9vbTogMlxuICB9KTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBJbml0aWFsaXplTWFwO1xuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vanMvaW5pdGlhbGl6ZS1tYXAuanMiLCJjb25zdCBDdXJyZW50TW9udGggPSB7fVxuXG5DdXJyZW50TW9udGguc2VsZWN0ZWRNb250aCA9IG5ldyBEYXRlKCkuZ2V0TW9udGgoKSArIDFcblxuQ3VycmVudE1vbnRoLmdldFNlbGVjdGVkTW9udGggPSAoKSA9PiBDdXJyZW50TW9udGguc2VsZWN0ZWRNb250aFxuXG5DdXJyZW50TW9udGguc2V0U2VsZWN0ZWRNb250aCA9IChuZXdNb250aCkgPT4geyBDdXJyZW50TW9udGguc2VsZWN0ZWRNb250aCA9IG5ld01vbnRoIH1cblxubW9kdWxlLmV4cG9ydHMgPSBDdXJyZW50TW9udGhcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL2pzL2N1cnJlbnQtbW9udGguanMiLCJ2YXIgTWFuYWdlTWFwTWFya2VycyA9IHt9O1xuXG52YXIgQmFja2VuZEludGVyZmFjZSA9IHJlcXVpcmUoJy4vYmFja2VuZC1pbnRlcmZhY2UuanMnKTtcbnZhciBJbml0aWFsaXplTWFwID0gcmVxdWlyZSgnLi9pbml0aWFsaXplLW1hcC5qcycpO1xudmFyIE9wdGltYWxUaW1lSW50ZXJ2YWwgPSByZXF1aXJlKCcuL29wdGltYWwtdGltZS1pbnRlcnZhbC5qcycpO1xudmFyIEN1cnJlbnRNb250aCA9IHJlcXVpcmUoJy4vY3VycmVudC1tb250aC5qcycpO1xuXG52YXIgYmVzdF93ZWF0aGVyX21vbnRocztcbnZhciBtYXJrZXJzID0gW107XG52YXIgaW5mb1dpbmRvdyA9IG5ldyBnb29nbGUubWFwcy5JbmZvV2luZG93KCk7XG5cbnZhciBtb250aEFiYnJldmlhdGlvbnMgPSBbJ0phbicsICdGZWInLCAnTWFyJywgJ0FwcicsICdNYXknLCAnSnVuJyxcbiAgICAgICdKdWwnLCAnQXVnJywgJ1NlcCcsICdPY3QnLCAnTm92JywgJ0RlYydcbiAgICBdO1xuXG52YXIgbG9hZGluZ19vdmVybGF5ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2xvYWRpbmctb3ZlcmxheS1lbGVtZW50Jyk7XG5cbk1hbmFnZU1hcE1hcmtlcnMucmVuZGVyQ2l0aWVzID0gZnVuY3Rpb24oY2l0aWVzKSB7XG4gICAgZGVsZXRlTWFya2VycygpO1xuICAgIHZhciBsYXRpdHVkZSwgbG9uZ2l0dWRlO1xuICAgIGZvciAodmFyIGtleSBpbiBjaXRpZXMpIHtcbiAgICAgICAgYmVzdF93ZWF0aGVyX21vbnRocyA9IE9wdGltYWxUaW1lSW50ZXJ2YWwuZmluZEJlc3RNb250aHMoY2l0aWVzW2tleV0pO1xuICAgICAgICBsYXRpdHVkZSA9IGNpdGllc1trZXldWzBdLmxhdGl0dWRlO1xuICAgICAgICBsb25naXR1ZGUgPSBjaXRpZXNba2V5XVswXS5sb25naXR1ZGU7XG4gICAgICAgIHZhciBzZWxlY3RlZF9tb250aCA9IEN1cnJlbnRNb250aC5nZXRTZWxlY3RlZE1vbnRoKCk7XG4gICAgICAgIGlmIChiZXN0X3dlYXRoZXJfbW9udGhzLmluZGV4T2Yoc2VsZWN0ZWRfbW9udGgpICE9PSAtMSkge1xuICAgICAgICAgICAgcHJlcE1hcmtlcnMobGF0aXR1ZGUsIGxvbmdpdHVkZSwga2V5LCBjaXRpZXNba2V5XVtzZWxlY3RlZF9tb250aF0udGVtcF9oaWdoLmF2Z1snQyddLCBjaXRpZXNba2V5XVtzZWxlY3RlZF9tb250aF0udGVtcF9sb3cuYXZnWydDJ10sIGNpdGllc1trZXldW3NlbGVjdGVkX21vbnRoXS5jaGFuY2Vfb2YuY2hhbmNlb2ZwcmVjaXAucGVyY2VudGFnZSwgYmVzdF93ZWF0aGVyX21vbnRocyk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgc2V0TWFwT25BbGwoSW5pdGlhbGl6ZU1hcC5tYXApO1xufVxuXG5mdW5jdGlvbiBwcmVwTWFya2VycyhsYXQsIGxuZywgbmFtZSwgaGlnaF90ZW1wLCBsb3dfdGVtcCwgcHJlY2lwX2NoYW5jZSwgYmVzdF9tb250aHMpIHtcblxuICAgICAgdmFyIGxhdExuZyA9IHtcbiAgICAgICAgICBcImxhdFwiOiBOdW1iZXIobGF0KSxcbiAgICAgICAgICBcImxuZ1wiOiBOdW1iZXIobG5nKVxuICAgICAgfVxuICAgICAgdmFyIG1hcmtlciA9IG5ldyBnb29nbGUubWFwcy5NYXJrZXIoe1xuICAgICAgICBwb3NpdGlvbjogbGF0TG5nLFxuICAgICAgICBtYXA6IEluaXRpYWxpemVNYXAubWFwLFxuICAgICAgICB0aXRsZTogbmFtZVxuICAgICAgfSlcblxuICAgICAgSW5pdGlhbGl6ZU1hcC5tYXAuYWRkTGlzdGVuZXIoJ2NsaWNrJywgZnVuY3Rpb24oKXtcbiAgICAgICAgICBpbmZvV2luZG93LmNsb3NlKCk7XG4gICAgICB9KVxuXG4gICAgICBtYXJrZXIuYWRkTGlzdGVuZXIoJ2NsaWNrJywgZnVuY3Rpb24oKSB7XG4gICAgICAgIGluZm9XaW5kb3cuY2xvc2UoKTtcbiAgICAgICAgdmFyIGJlc3RfbW9udGhzX25hbWVzID0gJyc7XG4gICAgICAgIGJlc3RfbW9udGhzLnNvcnQoZnVuY3Rpb24oYSwgYikge1xuICAgICAgICAgICAgcmV0dXJuIGEgLSBiO1xuICAgICAgICB9KVxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGJlc3RfbW9udGhzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBiZXN0X21vbnRoc19uYW1lcyArPSBtb250aEFiYnJldmlhdGlvbnNbYmVzdF9tb250aHNbaV1dICsgJyc7XG4gICAgICAgICAgICBpZiAoaSAhPT0gYmVzdF9tb250aHMubGVuZ3RoIC0gMSkge1xuICAgICAgICAgICAgICAgIGJlc3RfbW9udGhzX25hbWVzICs9ICcsICdcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBpbmZvV2luZG93LnNldENvbnRlbnQoJzxkaXY+JyArXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAnPGgyPicgKyBuYW1lICtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICc8L2gyPicgK1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJzxkaXY+IExvdzogJyArIGxvd190ZW1wICtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICcmIzg0NTE7PC9kaXY+JyArXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAnPGRpdj4gSGlnaDogJyArIGhpZ2hfdGVtcCArXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAnJiM4NDUxOzwvZGl2PicgK1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJzxkaXY+UHJlY2lwOiAnICsgcHJlY2lwX2NoYW5jZSArXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAnJTwvZGl2PicgK1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJzxkaXY+IEJlc3QgbW9udGhzOiAnICsgYmVzdF9tb250aHNfbmFtZXMgK1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAnPC9kaXY+Jyk7XG4gICAgICAgIGluZm9XaW5kb3cub3BlbihJbml0aWFsaXplTWFwLm1hcCwgbWFya2VyKTtcbiAgICAgIH0pO1xuXG4gICAgICBtYXJrZXJzLnB1c2gobWFya2VyKTtcbn1cblxuZnVuY3Rpb24gZGVsZXRlTWFya2VycygpIHtcbiAgY2xlYXJNYXJrZXJzKCk7XG4gIG1hcmtlcnMgPSBbXTtcbn1cblxuZnVuY3Rpb24gY2xlYXJNYXJrZXJzKCkge1xuICBzZXRNYXBPbkFsbChudWxsKTtcbn1cblxuZnVuY3Rpb24gc2V0TWFwT25BbGwobWFwKSB7XG4gIGZvciAodmFyIGkgPSAwOyBpIDwgbWFya2Vycy5sZW5ndGg7IGkrKykge1xuICAgIG1hcmtlcnNbaV0uc2V0TWFwKG1hcCk7XG4gIH1cbiAgbG9hZGluZ19vdmVybGF5LnN0eWxlLnZpc2liaWxpdHkgPSBcImhpZGRlblwiO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IE1hbmFnZU1hcE1hcmtlcnM7XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9qcy9tYW5hZ2UtbWFwLW1hcmtlcnMuanMiLCJjb25zdCBDb250cm9sc1VJID0ge31cblxuY29uc3QgQmFja2VuZEludGVyZmFjZSA9IHJlcXVpcmUoJy4vYmFja2VuZC1pbnRlcmZhY2UuanMnKVxuY29uc3QgTWFuYWdlTWFwTWFya2VycyA9IHJlcXVpcmUoJy4vbWFuYWdlLW1hcC1tYXJrZXJzLmpzJylcbmNvbnN0IEN1cnJlbnRNb250aCA9IHJlcXVpcmUoJy4vY3VycmVudC1tb250aC5qcycpXG5cbmNvbnN0IHNlbGVjdGVkTW9udGggPSBDdXJyZW50TW9udGguc2VsZWN0ZWRNb250aFxuXG5Db250cm9sc1VJLmluaXRpYWxpemVTZWxlY3RlZE1vbnRoID0gZnVuY3Rpb24oKSB7XG4gIGlmIChzZWxlY3RlZE1vbnRoID09PSAxMSkge1xuICAgICAgQ3VycmVudE1vbnRoLnNldFNlbGVjdGVkTW9udGgoMClcbiAgfVxuXG4gIGZvciAobGV0IGkgPSAwOyBpIDwgbW9udGhfd3JhcC5jaGlsZHJlbi5sZW5ndGg7IGkrKykge1xuICAgIGlmIChpID09PSBzZWxlY3RlZE1vbnRoKSB7XG4gICAgICBtb250aF93cmFwLmNoaWxkcmVuW2ldLmNsYXNzTmFtZSArPSBcIiBzZWxlY3RlZFwiXG4gICAgICBicmVha1xuICAgIH1cbiAgfVxufVxuXG5Db250cm9sc1VJLnJlbW92ZVNlbGVjdGVkQ2xhc3MgPSBmdW5jdGlvbihlbGVtZW50KSB7XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBlbGVtZW50LmNoaWxkcmVuLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIGVsZW1lbnQuY2hpbGRyZW5baV0uY2xhc3NOYW1lID0gXCJtb250aC1idXR0b25cIjtcbiAgICB9XG59XG5cbnZhciBtb250aF93cmFwID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJtb250aC13cmFwLWlkXCIpO1xubW9udGhfd3JhcC5vbmNsaWNrID0gZnVuY3Rpb24oZXZlbnQpIHtcbiAgICB2YXIgZWxlbWVudCA9IGV2ZW50LnRhcmdldDtcbiAgICBDb250cm9sc1VJLnJlbW92ZVNlbGVjdGVkQ2xhc3MoZWxlbWVudC5wYXJlbnROb2RlKTtcbiAgICBlbGVtZW50LmNsYXNzTmFtZSArPSBcIiBzZWxlY3RlZFwiO1xuICAgIEN1cnJlbnRNb250aC5zZXRTZWxlY3RlZE1vbnRoKE51bWJlcihlbGVtZW50LnZhbHVlKSk7XG4gICAgTWFuYWdlTWFwTWFya2Vycy5yZW5kZXJDaXRpZXMoQmFja2VuZEludGVyZmFjZS5wbGFjZXNfbGlzdCk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gQ29udHJvbHNVSTtcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL2pzL2NvbnRyb2xzLXVpLmpzIiwidmFyIFdlYXRoZXJEYXRhSW1wb3J0ID0ge307XG5cbnZhciBCYWNrZW5kSW50ZXJmYWNlID0gcmVxdWlyZSgnLi9iYWNrZW5kLWludGVyZmFjZS5qcycpO1xuXG52YXIgdXBsb2FkX21vbnRoID0gMDtcbnZhciBjYWxsc19udW1iZXIgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImNhbGxzLW51bWJlclwiKTtcblxudmFyIHB1bGxfaW50ZXJ2YWw7XG5cbnZhciBXVV9BUElfS0VZID0gJyc7XG5cbldlYXRoZXJEYXRhSW1wb3J0LmluaXRpYWxpemVJbXBvcnQgPSBmdW5jdGlvbigpIHtcbiAgICB2YXIgc3RhcnRfYWRkaW5nX2J1dHRvbiA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdzdGFydC1hZGRpbmctYnV0dG9uJyk7XG4gICAgc3RhcnRfYWRkaW5nX2J1dHRvbi5vbmNsaWNrID0gZnVuY3Rpb24oKSB7XG4gICAgICAgIHB1bGxfaW50ZXJ2YWwgPSBzZXRJbnRlcnZhbChmdW5jdGlvbigpIHsgYWRkTmV3UGxhY2UoKSB9LCAxMDAwMCk7XG4gICAgfVxuXG4gICAgZ2V0S2V5KCk7XG59XG5cbmZ1bmN0aW9uIGFkZE5ld1BsYWNlKCkge1xuICAgIHZhciBjaXR5X25hbWUgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInBsYWNlX25hbWVcIikudmFsdWU7XG4gICAgdmFyIGxvbmdpdHVkZSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwibG9uZ2l0dWRlXCIpLnZhbHVlO1xuICAgIHZhciBsYXRpdHVkZSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwibGF0aXR1ZGVcIikudmFsdWU7XG5cbiAgICB2YXIgcGxhY2VzX3JlZiA9IEJhY2tlbmRJbnRlcmZhY2UubXlGaXJlYmFzZVJlZi5jaGlsZChcInBsYWNlcy9cIiArIGNpdHlfbmFtZSArIFwiL1wiICsgdXBsb2FkX21vbnRoKTtcblxuICAgIHZhciBmaXJlYmFzZV9wYXlsb2FkID0ge307XG5cbiAgICB2YXIgeGh0dHAgPSBuZXcgWE1MSHR0cFJlcXVlc3QoKTtcbiAgICAgICAgeGh0dHAub25yZWFkeXN0YXRlY2hhbmdlID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgaWYgKHhodHRwLnJlYWR5U3RhdGUgPT0gNCAmJiB4aHR0cC5zdGF0dXMgPT0gMjAwKSB7XG4gICAgICAgICAgICAgIHZhciBqc29uX3Jlc3BvbnNlID0gSlNPTi5wYXJzZSh4aHR0cC5yZXNwb25zZSk7XG5cbiAgICAgICAgICAgICAgY29uc29sZS5sb2coanNvbl9yZXNwb25zZSk7XG5cbiAgICAgICAgICAgICAgZmlyZWJhc2VfcGF5bG9hZCA9IGpzb25fcmVzcG9uc2UudHJpcDtcbiAgICAgICAgICAgICAgZmlyZWJhc2VfcGF5bG9hZC5sYXRpdHVkZSA9IGxhdGl0dWRlO1xuICAgICAgICAgICAgICBmaXJlYmFzZV9wYXlsb2FkLmxvbmdpdHVkZSA9IGxvbmdpdHVkZTtcblxuICAgICAgICAgICAgICBwbGFjZXNfcmVmLnNldChmaXJlYmFzZV9wYXlsb2FkKTtcbiAgICAgICAgICB9XG4gICAgICAgIH07XG5cbiAgICAgICAgdmFyIGZvcm1hdHRlZF91cGxvYWRfbW9udGggPSBmb3JtYXRNb250aEZvclJlcXVlc3QodXBsb2FkX21vbnRoKTtcbiAgICAgICAgdmFyIGZpbHRlcl9kYXRlID0ge1xuICAgICAgICAgICAgc3RhcnRfZGF5OiAnMDEnLFxuICAgICAgICAgICAgZW5kX2RheTogJzI4J1xuICAgICAgICB9XG5cbiAgICAgICAgdmFyIGVuZHBvaW50ID0gXCJodHRwOi8vYXBpLnd1bmRlcmdyb3VuZC5jb20vYXBpL1wiXG4gICAgICAgICAgICAgICAgICAgICAgICAgKyBXVV9BUElfS0VZXG4gICAgICAgICAgICAgICAgICAgICAgICAgKyBcIi9wbGFubmVyX1wiXG4gICAgICAgICAgICAgICAgICAgICAgICAgKyBmb3JtYXR0ZWRfdXBsb2FkX21vbnRoXG4gICAgICAgICAgICAgICAgICAgICAgICAgKyBmaWx0ZXJfZGF0ZS5zdGFydF9kYXlcbiAgICAgICAgICAgICAgICAgICAgICAgICArIGZvcm1hdHRlZF91cGxvYWRfbW9udGhcbiAgICAgICAgICAgICAgICAgICAgICAgICArIGZpbHRlcl9kYXRlLmVuZF9kYXlcbiAgICAgICAgICAgICAgICAgICAgICAgICArIFwiL3EvXCJcbiAgICAgICAgICAgICAgICAgICAgICAgICArIGxhdGl0dWRlXG4gICAgICAgICAgICAgICAgICAgICAgICAgKyAnLCdcbiAgICAgICAgICAgICAgICAgICAgICAgICArIGxvbmdpdHVkZVxuICAgICAgICAgICAgICAgICAgICAgICAgICsgXCIuanNvblwiO1xuICAgICAgICB4aHR0cC5vcGVuKFwiR0VUXCIsIGVuZHBvaW50LCB0cnVlKTtcbiAgICAgICAgeGh0dHAuc2VuZCgpO1xuXG4gICAgICAgIGlmICh1cGxvYWRfbW9udGggPT09IDExKSB7XG4gICAgICAgICAgICBjbGVhckludGVydmFsKHB1bGxfaW50ZXJ2YWwpO1xuICAgICAgICB9XG4gICAgICAgICsrdXBsb2FkX21vbnRoO1xuICAgICAgICB1cGRhdGVVSUNhbGxzKCk7XG59XG5cbmZ1bmN0aW9uIGdldEtleSgpIHtcbiAgICB2YXIgY29uZmlnX3JlZiA9IEJhY2tlbmRJbnRlcmZhY2UubXlGaXJlYmFzZVJlZi5jaGlsZChcImNvbmZpZy9XVV9BUElfS0VZXCIpO1xuICAgIGNvbmZpZ19yZWYub24oXCJ2YWx1ZVwiLCBmdW5jdGlvbihzbmFwc2hvdCkge1xuICAgIFdVX0FQSV9LRVkgPSBzbmFwc2hvdC52YWwoKTtcbiAgICB9LCBmdW5jdGlvbiAoZXJyb3JPYmplY3QpIHtcbiAgICAgIGNvbnNvbGUubG9nKFwiVGhlIHJlYWQgZmFpbGVkOiBcIiArIGVycm9yT2JqZWN0LmNvZGUpO1xuICAgIH0pO1xufVxuXG5mdW5jdGlvbiB1cGRhdGVVSUNhbGxzKCkge1xuICAgIGNhbGxzX251bWJlci5pbm5lckhUTUwgPSB1cGxvYWRfbW9udGg7XG59O1xuXG5mdW5jdGlvbiBmb3JtYXRNb250aEZvclJlcXVlc3QobW9udGgpIHtcbiAgICB2YXIgbW9udGhBc051bWJlciA9IE51bWJlcihtb250aCk7XG4gICAgdmFyIGNsZWFuZWRVcE1vbnRoID0gJyc7XG4gICAgbW9udGhBc051bWJlciArPSAxO1xuXG4gICAgdmFyIG1vbnRoQXNTdHJpbmcgPSBtb250aEFzTnVtYmVyLnRvU3RyaW5nKCk7XG4gICAgaWYgKG1vbnRoQXNTdHJpbmcubGVuZ3RoID09PSAxKSB7XG4gICAgICAgIGNsZWFuZWRVcE1vbnRoID0gJzAnLmNvbmNhdChtb250aEFzU3RyaW5nKTtcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICAgIGNsZWFuZWRVcE1vbnRoID0gbW9udGhBc1N0cmluZztcbiAgICB9XG4gICAgcmV0dXJuIGNsZWFuZWRVcE1vbnRoO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IFdlYXRoZXJEYXRhSW1wb3J0O1xuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vanMvd2VhdGhlci1kYXRhLWltcG9ydC5qcyIsInZhciBJbml0aWFsaXplTWFwID0gcmVxdWlyZSgnLi9pbml0aWFsaXplLW1hcC5qcycpXG52YXIgQ29udHJvbHNVSSA9IHJlcXVpcmUoJy4vY29udHJvbHMtdWkuanMnKVxudmFyIEJhY2tlbmRJbnRlcmZhY2UgPSByZXF1aXJlKCcuL2JhY2tlbmQtaW50ZXJmYWNlLmpzJylcbnZhciBXZWF0aGVyRGF0YUltcG9ydCA9IHJlcXVpcmUoJy4vd2VhdGhlci1kYXRhLWltcG9ydC5qcycpXG5cbndpbmRvdy5vbmxvYWQgPSBmdW5jdGlvbigpIHtcbiAgICBJbml0aWFsaXplTWFwLmluaXRNYXAoKVxuICAgIEJhY2tlbmRJbnRlcmZhY2UuZ2V0UGxhY2VzKClcbiAgICBDb250cm9sc1VJLmluaXRpYWxpemVTZWxlY3RlZE1vbnRoKClcbiAgICBXZWF0aGVyRGF0YUltcG9ydC5pbml0aWFsaXplSW1wb3J0KClcbn1cblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL2pzL2luZGV4LmpzIiwidmFyIE9wdGltYWxUaW1lSW50ZXJ2YWwgPSB7fTtcblxudmFyIGlkZWFsX3RlbXAgPSAyMjtcbnZhciBpZGVhbF9wcmVjaXAgPSAwO1xudmFyIG51bWJlcl9vZl9pZGVhbF9tb250aHMgPSA0O1xuXG5PcHRpbWFsVGltZUludGVydmFsLmZpbmRCZXN0TW9udGhzID0gZnVuY3Rpb24oY2l0eV9kYXRhKSB7XG5cbiAgICB2YXIgd2VhdGhlcl9zY29yZXMgPSBbXTtcbiAgICB2YXIgaWRlYWxfbW9udGhzID0gW107XG5cbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGNpdHlfZGF0YS5sZW5ndGg7IGkrKykge1xuXG4gICAgICAgIHZhciByYXdfcHJlY2lwX3BlcmNlbnRhZ2UgPSBjaXR5X2RhdGFbaV0uY2hhbmNlX29mLmNoYW5jZW9mcHJlY2lwLnBlcmNlbnRhZ2U7XG4gICAgICAgIHZhciBmb3JtYXR0ZWRfcHJlY2lwX3BlcmNlbnRhZ2UgPSBOdW1iZXIocmF3X3ByZWNpcF9wZXJjZW50YWdlKTtcblxuICAgICAgICB2YXIgcmF3X2hpZ2hfdGVtcF9hdmcgPSBjaXR5X2RhdGFbaV0udGVtcF9oaWdoLmF2Z1snQyddO1xuICAgICAgICB2YXIgcmF3X2xvd190ZW1wX2F2ZyA9IGNpdHlfZGF0YVtpXS50ZW1wX2xvdy5hdmdbJ0MnXTtcblxuICAgICAgICB2YXIgZm9ybWF0dGVkX2F2Z190ZW1wID0gKE51bWJlcihyYXdfaGlnaF90ZW1wX2F2ZykgKyBOdW1iZXIocmF3X2xvd190ZW1wX2F2ZykpLzI7XG4gICAgICAgIHZhciBkaWZmZXJlbmNlX2Zyb21faWRlYWxfdGVtcCA9IE1hdGguYWJzKGlkZWFsX3RlbXAgLSBmb3JtYXR0ZWRfYXZnX3RlbXApO1xuXG4gICAgICAgIHZhciB3ZWF0aGVyX3Njb3JlX2l0ZW0gPSAwLjMgKiAoZm9ybWF0dGVkX3ByZWNpcF9wZXJjZW50YWdlIC8gMTAwKSArIDAuNyAqIChkaWZmZXJlbmNlX2Zyb21faWRlYWxfdGVtcCAvIDI1KTtcblxuICAgICAgICB3ZWF0aGVyX3Njb3Jlcy5wdXNoKHtcbiAgICAgICAgICAgIFwic2NvcmVcIjogd2VhdGhlcl9zY29yZV9pdGVtLFxuICAgICAgICAgICAgXCJtb250aFwiOiBpXG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIHNvcnRXZWF0aGVyKHdlYXRoZXJfc2NvcmVzKTtcblxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbnVtYmVyX29mX2lkZWFsX21vbnRoczsgaSsrICkge1xuICAgICAgICBpZGVhbF9tb250aHMucHVzaCh3ZWF0aGVyX3Njb3Jlc1tpXS5tb250aCk7XG4gICAgfVxuICAgIHJldHVybiBpZGVhbF9tb250aHM7XG59XG5cbmZ1bmN0aW9uIHNvcnRXZWF0aGVyKHdlYXRoZXJfc2NvcmVzKSB7XG4gICAgd2VhdGhlcl9zY29yZXMuc29ydChcbiAgICAgICAgZnVuY3Rpb24oYSwgYikge1xuICAgICAgICAgICAgcmV0dXJuIGEuc2NvcmUgLSBiLnNjb3JlXG4gICAgfSk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gT3B0aW1hbFRpbWVJbnRlcnZhbDtcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL2pzL29wdGltYWwtdGltZS1pbnRlcnZhbC5qcyJdLCJzb3VyY2VSb290IjoiIn0=