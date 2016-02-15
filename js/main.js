'use strict';

var InitializeMap = require('./initialize_map.js');
var ControlsUI = require('./controls_ui.js');
var BackendInterface = require('./backend_interface.js');
var WeatherDataImport = require('./weather_data_import.js');

window.onload = function() {
    InitializeMap.initMap();
    BackendInterface.getPlaces();
    ControlsUI.initializeSelectedMonth();
    WeatherDataImport.initializeImport();
}
