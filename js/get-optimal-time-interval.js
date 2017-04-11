import DEFAULT_WEATHER_CONSTANTS from './constants/weather'

function sortWeather(weatherScores) {
  weatherScores.sort((a, b) => a.score - b.score)
}

export default (cityData) => {
  const weatherScores = []
  const idealMonths = []

  for (let i = 0; i < cityData.length; i += 1) {
    const rawPrecipPercentage = cityData[i].chanceOf.chanceofprecip.percentage
    const formattedPrecipPercentage = Number(rawPrecipPercentage)

    const rawHighTempAvg = cityData[i].tempHigh.avg.C
    const rawLowTempAvg = cityData[i].tempLow.avg.C

    const formattedAvgTemp = (Number(rawHighTempAvg) + Number(rawLowTempAvg)) / 2
    const idealTemp = Math.abs(DEFAULT_WEATHER_CONSTANTS.idealTemp - formattedAvgTemp)

    const weatherScoreItem = (0.3 * (formattedPrecipPercentage / 100)) + (0.7 * (idealTemp / 25))

    weatherScores.push({
      score: weatherScoreItem,
      month: i,
    })
  }

  sortWeather(weatherScores)
  for (let i = 0; i < DEFAULT_WEATHER_CONSTANTS.idealMonthCount; i += 1) {
    idealMonths.push(weatherScores[i].month)
  }
  return idealMonths
}
