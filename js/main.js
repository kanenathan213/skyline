'use strict';

var InitializeMap = require('./initialize_map.js');
require('./controls_ui.js');
require('./backend_interface.js');
require('./weather_data_import.js');

window.onload = InitializeMap.initMap;
