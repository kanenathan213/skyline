import apiWrapper from 'boundaries/api-wrapper.js'
import { mainResource } from 'config/api'

let uploadMonth = 0
const callsNumber = document.getElementById('calls-number')

let pullInterval

let WU_API_KEY = ''

function formatMonthForRequest(month) {
  let monthAsNumber = Number(month)
  let cleanedUpMonth = ''
  monthAsNumber += 1

  const monthAsString = monthAsNumber.toString()
  if (monthAsString.length === 1) {
    cleanedUpMonth = '0'.concat(monthAsString)
  } else {
    cleanedUpMonth = monthAsString
  }
  return cleanedUpMonth
}

function updateUICalls() {
  callsNumber.innerHTML = uploadMonth
}

function addNewPlace() {
  const cityName = document.getElementById('place_name').value
  const longitude = document.getElementById('longitude').value
  const latitude = document.getElementById('latitude').value

  const placesRef = apiWrapper().child(`places/${cityName}/${uploadMonth}`)

  let firebasePayload = {}

  // TODO: change to fetch
  const xhttp = new XMLHttpRequest()
  xhttp.onreadystatechange = () => {
    if (xhttp.readyState === 4 && xhttp.status === 200) {
      const jsonResponse = JSON.parse(xhttp.response)
      firebasePayload = jsonResponse.trip
      firebasePayload.latitude = latitude
      firebasePayload.longitude = longitude

      placesRef.set(firebasePayload)
    }
  }

  const formattedUploadMonth = formatMonthForRequest(uploadMonth)
  const filterDate = {
    start_day: '01',
    end_day: '28',
  }

  /* eslint-disable */
  const endpoint = "http://api.wunderground.com/api/"
                   + WU_API_KEY
                   + "/planner_"
                   + formattedUploadMonth
                   + filterDate.start_day
                   + formattedUploadMonth
                   + filterDate.end_day
                   + "/q/"
                   + latitude
                   + ','
                   + longitude
                   + ".json"
  /* eslint-enable */
  xhttp.open('GET', endpoint, true)
  xhttp.send()

  if (uploadMonth === 11) {
    clearInterval(pullInterval)
  }
  uploadMonth += 1
  updateUICalls()
}

function getKey() {
  const configRef = mainResource.child('config/WU_API_KEY')
  configRef.on('value', (snapshot) => {
    WU_API_KEY = snapshot.val()
  }, (errorObject) => {
    console.log("The read failed: " + errorObject.code) // eslint-disable-line
  })
}

export default () => {
  const startAddingButton = document.getElementById('start-adding-button')
  startAddingButton.onclick = () => {
    pullInterval = setInterval(() => { addNewPlace() }, 10000)
  }
  getKey()
}
