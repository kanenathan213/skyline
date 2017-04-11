var InitializeMap = require('./initialize-map.js')
var ControlsUI = require('./controls-ui.js')
var BackendInterface = require('./backend-interface.js')
var WeatherDataImport = require('./weather-data-import.js')

window.onload = function() {
    InitializeMap.initMap()
    BackendInterface.getPlaces()
    ControlsUI.initializeSelectedMonth()
    WeatherDataImport.initializeImport()
}
