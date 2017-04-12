import initializeMap from 'view/map'
import getPlaces from 'boundaries/api-wrapper'
import initializeWeatherDataImport from 'boundaries/weather-data-import'
import renderSelectedMonth from 'view/controls'

initializeMap()
renderSelectedMonth()
getPlaces()
initializeWeatherDataImport()
