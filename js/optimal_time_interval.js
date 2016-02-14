var OptimalTimeInterval = {};

var ideal_temp = 22;
var ideal_precip = 0;
var number_of_ideal_months = 4;

OptimalTimeInterval.findBestMonths = function(city_data) {

    var weather_scores = [];
    var ideal_months = [];

    for (var i = 0; i < city_data.length; i++) {

        var raw_precip_percentage = city_data[i].chance_of.chanceofprecip.percentage;
        var formatted_precip_percentage = Number(raw_precip_percentage);

        var raw_high_temp_avg = city_data[i].temp_high.avg['C'];
        var raw_low_temp_avg = city_data[i].temp_low.avg['C'];

        var formatted_avg_temp = (Number(raw_high_temp_avg) + Number(raw_low_temp_avg))/2;
        var difference_from_ideal_temp = Math.abs(ideal_temp - formatted_avg_temp);

        var weather_score_item = 0.3 * (formatted_precip_percentage / 100) + 0.7 * (difference_from_ideal_temp / 25);

        weather_scores.push({
            "score": weather_score_item,
            "month": i
        });
    }

    weather_scores.sort(
        function(a, b) {
            return a.score - b.score
    });

    for (var i = 0; i < number_of_ideal_months; i++ ) {
        ideal_months.push(weather_scores[i].month);
    }
    return ideal_months;
}

module.exports = OptimalTimeInterval;
