import DEFAULT_WEATHER_CONSTANTS from 'constants/weather'
import dataKeys from 'constants/data-keys'
import flow from 'lodash/flow'

const sortWeather = weatherScores => weatherScores.sort((a, b) => a.score - b.score)

const getMonthsList = sortedScores => sortedScores.map(score => score.month)

const getWeatherScores = places => places.map((place, i) => {
  const rawPrecipPercentage = place.chanceOf.chanceofprecip.percentage
  const formattedPrecipPercentage = Number(rawPrecipPercentage)

  const rawHighTempAvg = place.tempHigh.avg[dataKeys.TEMPERATURE_TYPE]
  const rawLowTempAvg = place.tempLow.avg[dataKeys.TEMPERATURE_TYPE]

  const formattedAvgTemp = (Number(rawHighTempAvg) + Number(rawLowTempAvg)) / 2
  const idealTemp = Math.abs(DEFAULT_WEATHER_CONSTANTS.idealTemp - formattedAvgTemp)

  const weatherScoreItem = (0.3 * (formattedPrecipPercentage / 100)) + (0.7 * (idealTemp / 25))
  return {
    score: weatherScoreItem,
    month: i,
  }
})

export default (cityData) => {
  const getMonths = flow(getWeatherScores, sortWeather, getMonthsList)

  return getMonths(cityData).slice(0, DEFAULT_WEATHER_CONSTANTS.idealMonthCount)
}
