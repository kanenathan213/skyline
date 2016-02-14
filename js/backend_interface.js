var BackendInterface = {};

var ManageMapMarkers = require('./manage_map_markers.js');
var OptimalTimeInterval = require('./optimal_time_interval.js');

var places_list_ref = new Firebase("https://skyline-maps.firebaseio.com/places");

BackendInterface.myFirebaseRef = new Firebase("https://skyline-maps.firebaseio.com/");

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
