import CurrentMonth from 'current-month'

describe('CurrentMonth.setSelectedMonth', () => {
  it('updates month', () => {
    const newMonth = 4
    CurrentMonth.setSelectedMonth(newMonth)
    expect(CurrentMonth.getSelectedMonth()).toBe(newMonth)
  })
})
