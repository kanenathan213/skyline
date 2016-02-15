var ManageMapMarkers = {};

var BackendInterface = require('./backend_interface.js');
var InitializeMap = require('./initialize_map.js');
var OptimalTimeInterval = require('./optimal_time_interval.js');
var CurrentMonth = require('./current_month.js');

var best_weather_months;
var markers = [];
var infoWindow = new google.maps.InfoWindow();

var monthAbbreviations = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
      'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
    ];

var loading_overlay = document.getElementById('loading-overlay-element');

ManageMapMarkers.renderCities = function(cities) {
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
}

function prepMarkers(lat, lng, name, high_temp, low_temp, precip_chance, best_months) {

      var latLng = {
          "lat": Number(lat),
          "lng": Number(lng)
      }
      var marker = new google.maps.Marker({
        position: latLng,
        map: InitializeMap.map,
        title: name
      })

      InitializeMap.map.addListener('click', function(){
          infoWindow.close();
      })

      marker.addListener('click', function() {
        infoWindow.close();
        var best_months_names = '';
        best_months.sort(function(a, b) {
            return a - b;
        })
        for (var i = 0; i < best_months.length; i++) {
            best_months_names += monthAbbreviations[best_months[i]] + '';
            if (i !== best_months.length - 1) {
                best_months_names += ', '
            }
        }
        infoWindow.setContent('<div>' +
                                    '<h2>' + name +
                                    '</h2>' +
                                    '<div> Low: ' + low_temp +
                                    '&#8451;</div>' +
                                    '<div> High: ' + high_temp +
                                    '&#8451;</div>' +
                                    '<div>Precip: ' + precip_chance +
                                    '%</div>' +
                                    '<div> Best months: ' + best_months_names +
                                '</div>');
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
