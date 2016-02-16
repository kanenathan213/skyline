jest.dontMock('../js/current_month');

describe('CurrentMonth.setSelectedMonth', function() {
 it('updates month', function() {
   var CurrentMonth = require('../js/current_month');
   var new_month = 4;
   CurrentMonth.setSelectedMonth(new_month);
   expect(CurrentMonth.getSelectedMonth()).toBe(new_month);
 });
});
