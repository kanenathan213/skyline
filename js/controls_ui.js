var ControlsUI = {};

var selected_month = new Date().getMonth() + 1;

initializeSelectedMonth();

function initializeSelectedMonth() {
    var month_wrap = document.getElementById("month-wrap-id");

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

function addSelectedClass(event) {

    var element = event.target;
    removeSelectedClass(element.parentNode);
    element.className += " selected";
    selected_month = element.value;
    renderCities();
}

function removeSelectedClass(element) {
    for (var i = 0; i < element.children.length; i++) {
        element.children[i].className = "month-button";
    }
}

module.exports = ControlsUI;
