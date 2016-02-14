var BackendInterface = {};

var ManageMapMarkers = require('./manage_map_markers.js');

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
