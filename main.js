'use strict';

var myFirebaseRef = new Firebase("https://skyline-maps.firebaseio.com/");
var places_list_ref = new Firebase("https://skyline-maps.firebaseio.com/places");

var places_list = {};

places_list_ref.on("value", function(snapshot) {
  places_list = snapshot.val();
  console.log(places_list);
  renderCities();
}, function (errorObject) {
  console.log("The read failed: " + errorObject.code);
});

var WU_API_KEY = "8c6b1a4b7c885a22";

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

updateUICalls();

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
