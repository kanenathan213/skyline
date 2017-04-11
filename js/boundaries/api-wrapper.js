import { camelizeKeys } from 'humps'
import store from 'store'
import { placesResource } from 'config/api'

function handlePlacesDataSuccess(snapshot) {
  store.places = camelizeKeys(snapshot.val())
}

function handlePlacesDataFail(errorObject) {
  console.log('The read failed: ' + errorObject.code); // eslint-disable-line
}

export default () => {
  placesResource.once('value', handlePlacesDataSuccess, handlePlacesDataFail)
}
