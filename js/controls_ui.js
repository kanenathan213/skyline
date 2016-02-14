var ControlsUI = {};

var BackendInterface = require('./backend_interface.js');
var ManageMapMarkers = require('./manage_map_markers.js');

ControlsUI.selected_month = new Date().getMonth() + 1;
var month_wrap = document.getElementById("month-wrap-id");

month_wrap.onclick = function(event) {
    var element = event.target;
    ControlsUI.removeSelectedClass(element.parentNode);
    element.className += " selected";
    this.selected_month = element.value;
    ManageMapMarkers.renderCities(BackendInterface.places_list);
}

ControlsUI.initializeSelectedMonth = function() {

    if (this.selected_month === 11) {
        this.selected_month = 0;
    }

    for (var i = 0; i < month_wrap.children.length; i++) {
        if (i === this.selected_month) {
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

ControlsUI.initializeSelectedMonth();

module.exports = ControlsUI;
