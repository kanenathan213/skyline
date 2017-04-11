import getPlaces from 'boundaries/api-wrapper'
import initializeWeatherDataImport from 'boundaries/weather-data-import'
import initializeMap from 'view/initialize-map'
import initializeSelectedMonth from 'view/controls-ui'


initializeMap()
getPlaces()
initializeSelectedMonth()
initializeWeatherDataImport()
