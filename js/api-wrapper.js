import { camelizeKeys } from 'humps'
import { placesResource } from './config/api'
import renderCities from './manage-map-markers.js'

let cachedPlacesList = []

function handlePlacesDataSuccess(snapshot) {
  cachedPlacesList = camelizeKeys(snapshot.val())
  renderCities(cachedPlacesList)
}

function handlePlacesDataFail(errorObject) {
  console.log('The read failed: ' + errorObject.code); // eslint-disable-line
}

export const getPlacesList = () => cachedPlacesList

export default () => { placesResource.once('value', handlePlacesDataSuccess, handlePlacesDataFail) }
