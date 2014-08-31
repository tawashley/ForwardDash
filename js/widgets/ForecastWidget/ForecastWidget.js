function ForecastWidget(config, helpers) {

    var widgetContainer = document.getElementById('forecast-container'),
        _html = [];

    var _config = {
        celsius: helpers.config.setValue(config.celsius, false),
        formatString: ((config.celsius) ? '&#8451;' : '&#8457;'),
        apiFormatString: ((config.celsius) ? 'metric' : 'imperial')
    };

    var _position;

    function _getUserLocation() {
        helpers.getLocation({
            options : {
                enableHighAccuracy : true,
                timeout : 10000, //10 seconds
                maximumAge : 0 //spec default is 0
            },
            completeCallback: function(position) {
                _position = position;
                _getForecast();
            }
        })
    }

    function _renderWeatherUI(response){
        response.list.forEach(function(day_forecast, index){
            _renderSingleDayForecast(day_forecast);
        });

        widgetContainer.innerHTML = _html.join('');
    }

    function _renderSingleDayForecast(day_forecast){
        console.log('forecast', day_forecast);

        _html.push('<div class="day-forecast">');
        _html.push('<div class="forecast-icon"></div>');

        _html.push('<div class="forecast-details">');
        _html.push('<div class="forecast-details--description">' + day_forecast.weather[0].main + '</div>');
        _html.push('<div class="forecast-details--description">' + Math.round(day_forecast.temp.day) + _config.formatString + '</div>');
        _html.push('</div>');

        _html.push('</div>');
    }

    function _getForecast(){
        helpers.asyncRequest({
            method: 'GET',
            type: 'json',
            uri: 'http://api.openweathermap.org/data/2.5/forecast/daily?lat=' + _position.coords.latitude + '&lon=' + _position.coords.longitude + '&units=' + _config.apiFormatString + '&type=accurate&cnt=7' //cnt 7 - seven day forecast
        }, function(response){
            _renderWeatherUI(response);
        });
    }

    var exports = {};

    exports.init = function() {
        _getUserLocation();
    };

    return exports;
};