var BackendInterface = {};

var ManageMapMarkers = require('./manage-map-markers.js');

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
