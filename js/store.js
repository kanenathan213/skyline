const initialState = {
  places: [],
  selectedMonthIndex: 11,
}

const handler = {
  get: (target, property) => target[property],
  set: (target, property, value) => {
    console.log('PREVIOUS STATE:', target) // eslint-disable-line
    target[property] = value
    console.log('NEXT STATE:', target) // eslint-disable-line
    return true
  },
}

export default new Proxy(initialState, handler)
