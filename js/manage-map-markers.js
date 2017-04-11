import getMap from './initialize-map'
import getOptimalTimeInterval from './optimal-time-interval'
import getSelectedMonth from './current-month'
import MONTH_ABBREVIATIONS from './constants/months'

let bestWeatherMonths
let markers = []
const infoWindow = new google.maps.InfoWindow()

const loadingOverlay = document.getElementById('loading-overlay-element')

function setMapOnAll(map) {
  for (let i = 0; i < markers.length; i += 1) {
    markers[i].setMap(map)
  }
  loadingOverlay.style.visibility = 'hidden'
}

function clearMarkers() {
  setMapOnAll(null)
}

function deleteMarkers() {
  clearMarkers()
  markers = []
}

function prepMarkers(lat, lng, name, highTemp, lowTemp, precipChance, bestMonths) {
  const latLng = {
    lat: Number(lat),
    lng: Number(lng),
  }
  const marker = new google.maps.Marker({
    position: latLng,
    map: getMap(),
    title: name,
  })

  getMap().addListener('click', () => {
    infoWindow.close()
  })

  marker.addListener('click', () => {
    infoWindow.close()
    let bestMonthsNames = ''
    bestMonths.sort((a, b) => a - b)
    for (let i = 0; i < bestMonths.length; i += 1) {
      bestMonthsNames += `${bestMonthsNames}${MONTH_ABBREVIATIONS[bestMonths[i]]}`
      if (i !== bestMonths.length - 1) {
        bestMonthsNames += ', '
      }
    }
    /* eslint-disable */
    infoWindow.setContent('<div>' +
                                '<h2>' + name +
                                '</h2>' +
                                '<div> Low: ' + lowTemp +
                                '&#8451;</div>' +
                                '<div> High: ' + highTemp +
                                '&#8451;</div>' +
                                '<div>Precip: ' + precipChance +
                                '%</div>' +
                                '<div> Best months: ' + bestMonthsNames +
                            '</div>')
    infoWindow.open(InitializeMap.map, marker)
    /* eslint-enable */
  })

  markers.push(marker)
}

export default (cities) => {
  deleteMarkers()
  let latitude
  let longitude
  Object.keys(cities).forEach((key) => {
    bestWeatherMonths = getOptimalTimeInterval(cities[key])
    latitude = cities[key][0].latitude
    longitude = cities[key][0].longitude
    const selectedMonth = getSelectedMonth()
    if (bestWeatherMonths.indexOf(selectedMonth) !== -1) {
      prepMarkers(latitude, longitude, key, cities[key][selectedMonth].tempHigh.avg.C,
        cities[key][selectedMonth].tempLow.avg.C,
        cities[key][selectedMonth].chanceOf.chanceofprecip.percentage, bestWeatherMonths)
    }
  })
  setMapOnAll(getMap())
}
