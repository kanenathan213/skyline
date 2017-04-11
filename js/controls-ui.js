const ControlsUI = {}

const BackendInterface = require('./backend-interface.js')
const ManageMapMarkers = require('./manage-map-markers.js')
const CurrentMonth = require('./current-month.js')

const selectedMonth = CurrentMonth.selectedMonth

ControlsUI.initializeSelectedMonth = function() {
  if (selectedMonth === 11) {
      CurrentMonth.setSelectedMonth(0)
  }

  for (let i = 0; i < month_wrap.children.length; i++) {
    if (i === selectedMonth) {
      month_wrap.children[i].className += " selected"
      break
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
