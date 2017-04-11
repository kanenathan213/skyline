const CurrentMonth = {}

CurrentMonth.selectedMonth = new Date().getMonth() + 1

CurrentMonth.getSelectedMonth = () => CurrentMonth.selectedMonth

CurrentMonth.setSelectedMonth = (newMonth) => { CurrentMonth.selectedMonth = newMonth }

module.exports = CurrentMonth
