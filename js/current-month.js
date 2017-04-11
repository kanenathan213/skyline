const currentMonth = new Map()

const MAIN_KEY = 'month'

// Initialize Map
currentMonth.set(MAIN_KEY, new Date().getMonth() + 1)

export default () => currentMonth.get(MAIN_KEY)
export const setSelectedMonth = (newMonth) => { currentMonth.set(MAIN_KEY, newMonth) }
