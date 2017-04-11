const FIREBASE_DOMAIN = 'https://skyline-maps.firebaseio.com/'
const PLACES_RESOURCE_LOCATION = 'places'

export const mainResource = new Firebase(FIREBASE_DOMAIN)
export const placesResource = new Firebase(`${FIREBASE_DOMAIN}/${PLACES_RESOURCE_LOCATION}`)
