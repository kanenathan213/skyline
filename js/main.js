'use strict';

var InitializeMap = require('./initialize_map.js');
require('./controls_ui.js');
require('./backend_interface.js');

window.onload = InitializeMap.initMap;
