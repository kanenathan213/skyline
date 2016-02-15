jest.dontMock('../js/current_month');

describe('CurrentMonth.getSelectedMonth', function() {
 it('initially returns the next month', function() {
   var CurrentMonth = require('../js/current_month');
   var next_month = new Date().getMonth() + 1;
   expect(CurrentMonth.getSelectedMonth()).toBe(next_month);
 });
});
