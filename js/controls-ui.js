import { getPlacesList } from './api-wrapper.js'
import renderCities from './manage-map-markers.js'
import getSelectedMonth, { setSelectedMonth } from './current-month.js'

const selectedMonth = getSelectedMonth()

const monthWrap = document.getElementById('month-wrap-id')

export default () => {
  if (selectedMonth === 11) {
    setSelectedMonth(0)
  }

  for (let i = 0; i < monthWrap.children.length; i += 1) {
    if (i === selectedMonth) {
      monthWrap.children[i].classList.add('selected')
      break
    }
  }
}

export const removeSelectedClass = (element) => {
  for (let i = 0; i < element.children.length; i += 1) {
    element.children[i].classList.remove('selected')
  }
}

monthWrap.onclick = (event) => {
  const element = event.target
  removeSelectedClass(element.parentNode)
  element.classList.add('selected')
  setSelectedMonth(Number(element.value))
  renderCities(getPlacesList())
}
