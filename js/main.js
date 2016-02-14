'use strict';

var myFirebaseRef = new Firebase("https://skyline-maps.firebaseio.com/");
var places_list_ref = new Firebase("https://skyline-maps.firebaseio.com/places");

var InitializeMap = require('./initialize_map.js');

var places_list = {};

var ideal_temp = 22;
var ideal_precip = 0;

var number_of_ideal_months = 4;

places_list_ref.on("value", function(snapshot) {
  places_list = snapshot.val();
  console.log(places_list);
  renderCities();
  var best_weather_months = findBestMonths(places_list["Bangkok"]);

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

window.onload = InitializeMap.initMap;
