var ManageMapMarkers = {};

var BackendInterface = require('./backend_interface.js');
var InitializeMap = require('./initialize_map.js');

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
