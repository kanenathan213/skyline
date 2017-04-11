var WeatherDataImport = {};

var BackendInterface = require('./backend-interface.js');

var upload_month = 0;
var calls_number = document.getElementById("calls-number");

var pull_interval;

var WU_API_KEY = '';

WeatherDataImport.initializeImport = function() {
    var start_adding_button = document.getElementById('start-adding-button');
    start_adding_button.onclick = function() {
        pull_interval = setInterval(function() { addNewPlace() }, 10000);
    }

    getKey();
}

function addNewPlace() {
    var city_name = document.getElementById("place_name").value;
    var longitude = document.getElementById("longitude").value;
    var latitude = document.getElementById("latitude").value;

    var places_ref = BackendInterface.myFirebaseRef.child("places/" + city_name + "/" + upload_month);

    var firebase_payload = {};

    var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function() {
          if (xhttp.readyState == 4 && xhttp.status == 200) {
              var json_response = JSON.parse(xhttp.response);

              console.log(json_response);

              firebase_payload = json_response.trip;
              firebase_payload.latitude = latitude;
              firebase_payload.longitude = longitude;

              places_ref.set(firebase_payload);
          }
        };

        var formatted_upload_month = formatMonthForRequest(upload_month);
        var filter_date = {
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

        if (upload_month === 11) {
            clearInterval(pull_interval);
        }
        ++upload_month;
        updateUICalls();
}

function getKey() {
    var config_ref = BackendInterface.myFirebaseRef.child("config/WU_API_KEY");
    config_ref.on("value", function(snapshot) {
    WU_API_KEY = snapshot.val();
    }, function (errorObject) {
      console.log("The read failed: " + errorObject.code);
    });
}

function updateUICalls() {
    calls_number.innerHTML = upload_month;
};

function formatMonthForRequest(month) {
    var monthAsNumber = Number(month);
    var cleanedUpMonth = '';
    monthAsNumber += 1;

    var monthAsString = monthAsNumber.toString();
    if (monthAsString.length === 1) {
        cleanedUpMonth = '0'.concat(monthAsString);
    }
    else {
        cleanedUpMonth = monthAsString;
    }
    return cleanedUpMonth;
}

module.exports = WeatherDataImport;
