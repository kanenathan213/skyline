var CurrentMonth = {};

CurrentMonth.selected_month = new Date().getMonth() + 1;

CurrentMonth.getSelectedMonth = function() {
    return CurrentMonth.selected_month;
}

CurrentMonth.setSelectedMonth = function(new_month) {
    CurrentMonth.selected_month = new_month;
}

module.exports = CurrentMonth;
