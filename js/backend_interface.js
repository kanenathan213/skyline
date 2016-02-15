var BackendInterface = {};

var ManageMapMarkers = require('./manage_map_markers.js');

var places_list_ref = new Firebase("https://skyline-maps.firebaseio.com/places/tokyo/1");

BackendInterface.myFirebaseRef = new Firebase("https://skyline-maps.firebaseio.com/");

BackendInterface.places_list = {};
var best_weather_months = [];

var handlePlacesDataSuccess = function(snapshot) {
  BackendInterface.places_list = snapshot.val();
  console.log(BackendInterface.places_list);
  ManageMapMarkers.renderCities(BackendInterface.places_list);
}

var handlePlacesDataFail = function (errorObject) {
  console.log("The read failed: " + errorObject.code);
}

places_list_ref.once("value", handlePlacesDataSuccess, handlePlacesDataFail);

module.exports = BackendInterface;
