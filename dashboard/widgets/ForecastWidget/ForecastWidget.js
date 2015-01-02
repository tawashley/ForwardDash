function ForecastWidget(dashboard) {

    var _html = [];

    var _dom = {
        widgetContainer: document.querySelector('#' + dashboard.container.id + ' [data-widget-forecast]')
    };

    var _config = {
        celsius: dashboard.helpers.config.setValue(dashboard.widgetConfig.celsius, false),
        formatString: ((dashboard.widgetConfig.celsius) ? '&#8451;' : '&#8457;'),
        apiFormatString: ((dashboard.widgetConfig.celsius) ? 'metric' : 'imperial'),
        showTemp: dashboard.helpers.config.setValue(dashboard.widgetConfig.showTemp, true),
        showDayString: dashboard.helpers.config.setValue(dashboard.widgetConfig.showDayString, false),
        shortDay: dashboard.helpers.config.setValue(dashboard.widgetConfig.shortDay, false),
        showForecastDescription: dashboard.helpers.config.setValue(dashboard.widgetConfig.showForecastDescription, true),
        hightlightTodaysForecast: dashboard.helpers.config.setValue(dashboard.widgetConfig.hightlightTodaysForecast, true),
    };

    var _position;

    function _getUserLocation() {
        dashboard.helpers.getLocation({
            options : {
                enableHighAccuracy : true,
                timeout : 10000, //10 seconds
                maximumAge : 0 //spec default is 0
            },
            completeCallback: function(position) {
                _position = position;
                _getForecast();
            }
        });
    }

    function _renderWeatherUI(response){
        response.list.forEach(function(day_forecast, index){
            _renderSingleDayForecast(day_forecast, index);
        });

        _dom.widgetContainer.innerHTML = _html.join('');
    }

    function _renderSingleDayForecast(day_forecast, day_number){
        //epoch date
        var forecastDate = new Date(day_forecast.dt * 1000);

        _html.push('<div class="day-forecast ' + ((_config.hightlightTodaysForecast) ? _checkAddTodayClass(forecastDate.getDay()) : '') + '">');

        _html.push('<div class="forecast-details">');
        _html.push('<div class="forecast-day">' +  ((_config.showDayString) ? dashboard.helpers.date.getDayString(forecastDate.getDay(), _config.shortDay) + ' ' : '') + + forecastDate.getDate() + ' ' + dashboard.helpers.date.getMonthString(forecastDate.getMonth(), true) + '</div>');
        _html.push('</div>');

        _html.push('<div class="forecast-icon">' + _renderForecastIconHTML(day_forecast.weather[0].main) + '</div>');

        _html.push('<div class="forecast-details">');

        if(_config.showForecastDescription){
            _html.push('<div class="forecast-details--description">' + day_forecast.weather[0].main + '</div>');
        }

        if(_config.showTemp){
            _html.push('<div class="forecast-details--temp">' + Math.round(day_forecast.temp.day) + _renderFormatStringHTML() + '</div>');
        }

        _html.push('</div>');

        _html.push('</div>');
    }

    function _checkAddTodayClass(day){
        return (day === new Date().getDay()) ? 'day-forecast--today' : '';
    }

    function _renderFormatStringHTML(){
        return '<sup class="forecast-details--temp-format">' + _config.formatString + '</sup>';
    }

    function _renderForecastIconHTML(type){
        var icon_class;

        switch(type.toLowerCase()){
            case 'rain':
                icon_class = 'icon-rainy';
                break;
            case 'clear':
                icon_class = 'icon-sunny';
                break;
            case 'clouds':
                icon_class = 'icon-cloudy-alt';
                break;
            case 'snow':
                icon_class = 'icon-snowy';
                break;
            default:
                console.warn('Icon for weather type of"' + type + '" has not yet been implemented - defaulting to sunny');
                icon_class = 'icon-sunny';
        }

        return '<i class="icon ' + icon_class + '"></i>';
    }

    function _getForecast(){
        dashboard.helpers.asyncRequest({
            method: 'GET',
            type: 'json',
            uri: 'http://api.openweathermap.org/data/2.5/forecast/daily?lat=' + _position.coords.latitude + '&lon=' + _position.coords.longitude + '&units=' + _config.apiFormatString + '&type=accurate&cnt=7' //cnt 7 - seven day forecast
        }).then(function(response){
            _renderWeatherUI(response);
        })
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
}
