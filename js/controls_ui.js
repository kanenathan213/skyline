var ControlsUI = {};

var BackendInterface = require('./backend_interface.js');
var ManageMapMarkers = require('./manage_map_markers.js');

var selected_month = new Date().getMonth() + 1;
var month_wrap = document.getElementById("month-wrap-id");

initializeSelectedMonth();

month_wrap.onclick = function(event) {
    var element = event.target;
    removeSelectedClass(element.parentNode);
    element.className += " selected";
    selected_month = element.value;
    ManageMapMarkers.renderCities(BackendInterface.places_list);
}

function initializeSelectedMonth() {

    if (selected_month === 11) {
        selected_month = 0;
    }

    for (var i = 0; i < month_wrap.children.length; i++) {
        if (i === selected_month) {
            month_wrap.children[i].className += " selected";
            break;
        }
    }
}

function removeSelectedClass(element) {
    for (var i = 0; i < element.children.length; i++) {
        element.children[i].className = "month-button";
    }
}

module.exports = ControlsUI;
