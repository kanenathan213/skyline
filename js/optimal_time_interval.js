var OptimalTimeInterval = {};

var ideal_temp = 22;
var ideal_precip = 0;
var number_of_ideal_months = 4;

OptimalTimeInterval.findBestMonths = function(city_data) {

    var precip_array = [];
    var temp_array = [];

    for (var i = 0; i < city_data.length; i++) {

        var raw_precip_percentage = city_data[i].chance_of.chanceofprecip.percentage;
        var formatted_precip_percentage = Number(raw_precip_percentage);

        var raw_high_temp_avg = city_data[i].temp_high.avg['C'];
        var raw_low_temp_avg = city_data[i].temp_low.avg['C'];

        var formatted_avg_temp = (Number(raw_high_temp_avg) + Number(raw_low_temp_avg))/2;

        var difference_from_ideal_temp = Math.abs(ideal_temp - formatted_avg_temp);

        precip_array.push([formatted_precip_percentage, i]);
        temp_array.push([difference_from_ideal_temp, i]);
    }

    var precip_months = sortMonths(precip_array);
    var temperature_months = sortMonths(temp_array);

    console.log(precip_months, temperature_months);

    var weather_scores = [];

    for (var w = 0; w < 12; w++) {

        var weather_score_item = precip_array[w][0] / 100 + temp_array[w][0] / 100;

        weather_scores.push([weather_score_item, w]);

    }

    weather_scores = sortMonths(weather_scores);

    console.log(weather_scores);

    var weather_score_indices = [];

    for (var i = 0; i < number_of_ideal_months; i++ ) {

        weather_score_indices.push(weather_scores[i][1]);

    }

    return weather_score_indices;
}

function sortMonths(months_with_data) {

    var months = months_with_data;

    for (var j = 0; j < months_with_data.length; j++) {

        for (var k = 0; k < months.length; k++) {

            var temporary_month = months[k];
            if (months_with_data[j][0] < months[k][0]) {

                months[k] = months_with_data[j];
                months_with_data[j] = temporary_month;
                break;
            }
        }
    }
    return months;
}

module.exports = OptimalTimeInterval;
