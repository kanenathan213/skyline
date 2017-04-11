import { getPlacesList } from 'boundaries/api-wrapper'
import renderCities from 'view/manage-map-markers'
import store from 'store'

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
