var ManageMapMarkers = {};

var BackendInterface = require('./backend_interface.js');
var InitializeMap = require('./initialize_map.js');
var OptimalTimeInterval = require('./optimal_time_interval.js');
var CurrentMonth = require('./current_month.js');

var best_weather_months;
var markers = [];

var loading_overlay = document.getElementById('loading-overlay-element');

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
  loading_overlay.style.visibility = "hidden";
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
