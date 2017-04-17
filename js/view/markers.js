import { mapInstance } from 'view/map'
import dataKeys from 'constants/data-keys'
import getOptimalTimeInterval from 'utils/get-optimal-time-interval'
import startCase from 'lodash/startCase'
import MONTH_ABBREVIATIONS from 'constants/months'
import type { StateType } from '../types/state'

let bestWeatherMonths
let markers = []
const infoWindow = new google.maps.InfoWindow()

const loadingOverlay = document.getElementById('loading-overlay-element')

const renderMarkers = () => {
  for (let i = 0; i < markers.length; i += 1) {
    markers[i].setMap(mapInstance)
  }
  loadingOverlay.style.visibility = 'hidden'
}

const clearMarkers = () => {
  markers.forEach(marker => marker.setMap(null))
  markers = []
}

const updateMarker = (lat, lng, name, highTemp, lowTemp, precipChance, bestMonths) => {
  const latLng = {
    lat: Number(lat),
    lng: Number(lng),
  }
  const marker = new google.maps.Marker({
    position: latLng,
    map: mapInstance,
    title: name,
  })
  mapInstance.addListener('click', () => {
    infoWindow.close()
  })

  marker.addListener('click', () => {
    infoWindow.close()
    let bestMonthsNames = ''
    const sortedBestMonths = bestMonths.sort((a, b) => a - b)
    for (let i = 0; i < sortedBestMonths.length; i += 1) {
      bestMonthsNames = `${bestMonthsNames}${MONTH_ABBREVIATIONS[sortedBestMonths[i]]}`
      if (i !== sortedBestMonths.length - 1) {
        bestMonthsNames += ', '
      }
    }
    infoWindow.setContent(
      `<div><h2>${name}</h2><div> Low: ${lowTemp}&#8451;</div><div> High: ${highTemp}
      &#8451;</div><div>Precip: ${precipChance}%</div><div> Best months: ${bestMonthsNames}</div>`)
    infoWindow.open(mapInstance, marker)
  })

  markers.push(marker)
}

const renderMapMarkers = (state: StateType) => {
  const { places: cities, selectedMonthIndex } = state
  clearMarkers()
  let latitude
  let longitude
  Object.keys(cities).forEach((key) => {
    bestWeatherMonths = getOptimalTimeInterval(cities[key])
    latitude = cities[key][0].latitude
    longitude = cities[key][0].longitude
    const selectedMonth = selectedMonthIndex

    if (bestWeatherMonths.includes(selectedMonth)) {
      updateMarker(latitude, longitude, startCase(key),
        cities[key][selectedMonth].tempHigh.avg[dataKeys.TEMPERATURE_TYPE],
        cities[key][selectedMonth].tempLow.avg[dataKeys.TEMPERATURE_TYPE],
        cities[key][selectedMonth].chanceOf.chanceofprecip.percentage, bestWeatherMonths)
    }
  })
  renderMarkers()
}

export default renderMapMarkers
