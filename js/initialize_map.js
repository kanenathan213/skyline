var InitializeMap = {};

InitializeMap.map = null;

InitializeMap.initMap = function() {

  InitializeMap.map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: 20, lng: 20},
    scrollwheel: true,
    zoom: 2,
    minZoom: 2
  });
}

module.exports = InitializeMap;
