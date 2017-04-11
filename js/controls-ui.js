import { getPlacesList } from './api-wrapper.js'
import renderCities from './manage-map-markers.js'
import store from './store.js'

const monthWrap = document.getElementById('month-wrap-id')

export default () => {
  for (let i = 0; i < monthWrap.children.length; i += 1) {
    if (i === store.selectedMonthIndex) {
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
  store.selectedMonthIndex = Number(element.value)
  renderCities(getPlacesList())
}
