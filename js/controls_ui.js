var ControlsUI = {};

var BackendInterface = require('./backend_interface.js');
var ManageMapMarkers = require('./manage_map_markers.js');
var CurrentMonth = require('./current_month.js');

var selected_month = CurrentMonth.selected_month;

ControlsUI.initializeSelectedMonth = function() {

    if (selected_month === 11) {
        CurrentMonth.setSelectedMonth(0);
    }

    for (var i = 0; i < month_wrap.children.length; i++) {
        if (i === selected_month) {
            month_wrap.children[i].className += " selected";
            break;
        }
    }
}

ControlsUI.removeSelectedClass = function(element) {
    for (var i = 0; i < element.children.length; i++) {
        element.children[i].className = "month-button";
    }
}

var month_wrap = document.getElementById("month-wrap-id");
month_wrap.onclick = function(event) {
    var element = event.target;
    ControlsUI.removeSelectedClass(element.parentNode);
    element.className += " selected";
    CurrentMonth.setSelectedMonth(Number(element.value));
    ManageMapMarkers.renderCities(BackendInterface.places_list);
}

module.exports = ControlsUI;
