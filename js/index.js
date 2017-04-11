import getPlaces from './api-wrapper'
import initializeMap from './initialize-map'
import initializeSelectedMonth from './controls-ui'
import initializeWeatherDataImport from './weather-data-import'


initializeMap()
getPlaces()
initializeSelectedMonth()
initializeWeatherDataImport()
