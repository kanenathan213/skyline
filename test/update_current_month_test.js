jest.dontMock('../js/current-month');

describe('CurrentMonth.setSelectedMonth', function() {
 it('updates month', function() {
   var CurrentMonth = require('../js/current-month');
   var new_month = 4;
   CurrentMonth.setSelectedMonth(new_month);
   expect(CurrentMonth.getSelectedMonth()).toBe(new_month);
 });
});
