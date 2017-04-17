import renderSelectedMonth from 'view/controls'
import renderMapMarkers from 'view/markers'
import getCurrentMonth from 'boundaries/get-current-month'
import eventTypes from 'event-types'

const initialState = {
  places: [],
  selectedMonthIndex: getCurrentMonth,
}

const updateView = (type, updatedData) => {
  renderSelectedMonth(updatedData)
  renderMapMarkers(updatedData)
}

const handler = {
  get: (target, property) => target[property],
  set: (target, property, value) => {
    if (target[property] === value) {
      return true
    }

    console.log('PREVIOUS STATE:', target) // eslint-disable-line
    console.log('EVENT:', property, value) // eslint-disable-line

    target[property] = value

    console.log('NEXT STATE:', target) // eslint-disable-line
    console.log('') // eslint-disable-line

    updateView(eventTypes.STATE_UPDATED, target)
    return true
  },
}

export default new Proxy(initialState, handler)
