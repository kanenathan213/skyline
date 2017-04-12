import { camelizeKeys } from 'humps'
import store from 'store'
import { placesResource } from 'config/api'

function handleSuccessResponse(snapshot) {
  store.places = camelizeKeys(snapshot.val())
}

function handleFailureResponse(errorObject) {
  console.log('The read failed: ' + errorObject.code); // eslint-disable-line
}

export default () => {
  placesResource.once('value', handleSuccessResponse, handleFailureResponse)
}
