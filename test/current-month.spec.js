import CurrentMonth from 'current-month'

describe('CurrentMonth.getSelectedMonth', () => {
  it('initially returns the next month', () => {
    const nextMonth = new Date().getMonth() + 1
    expect(CurrentMonth.getSelectedMonth()).toBe(nextMonth)
  })
})
