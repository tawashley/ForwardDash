function ForecastWidget(config, helpers) {

    var _html = [],
        _date = new Date();

    var _dom = {
        widgetContainer: document.getElementById('forecast-container')
    }

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
            _renderSingleDayForecast(day_forecast, index);
        });

        _dom.widgetContainer.innerHTML = _html.join('');
    }

    function _renderSingleDayForecast(day_forecast, day_number){
        console.log('forecast', day_forecast);

        _html.push('<div class="day-forecast">');

        _html.push('<div class="forecast-icon">' + _renderForecastIconHTML(day_forecast.weather[0].main) + '</div>');

        _html.push('<div class="forecast-details">');
        _html.push('<div class="forecast-details--description">' + day_forecast.weather[0].main + '</div>');
        _html.push('<div class="forecast-details--temp">' + Math.round(day_forecast.temp.day) + _config.formatString + '</div>');
        _html.push('</div>');

        _html.push('</div>');
    }

    function _renderForecastIconHTML(type){
        var icon_class;

        switch(type){
            case 'Rain':
                icon_class = 'icon-rainy'
                break;
            case 'Clear':
                icon_class = 'icon-sunny'
                break;
            case 'Clouds':
                icon_class = 'icon-cloudy-alt'
                break;
            default:
                console.warn('Icon for weather type of"' + type + '" has not yet been implemented - defaulting to sunny');
                icon_class = 'icon-sunny'
        }

        return '<i class="icon ' + icon_class + '"></i>';
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

    function _loadingUIMessage(){
        _dom.widgetContainer.innerHTML = '<div class="loading-message">Getting the weather forecast</div>';
    }

    var exports = {};

    exports.init = function() {
        _loadingUIMessage();
        _getUserLocation();
    };

    return exports;
};