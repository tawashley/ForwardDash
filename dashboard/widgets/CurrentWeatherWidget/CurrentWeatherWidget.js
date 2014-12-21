function CurrentWeatherWidget(dashboard) {

    var _config = {
        celsius: dashboard.helpers.config.setValue(dashboard.widgetConfig.celsius, false),
        formatString: ((dashboard.widgetConfig.celsius) ? '&#8451;' : '&#8457;'),
        apiFormatString: ((dashboard.widgetConfig.celsius) ? 'metric' : 'imperial'),
        showPlaceName: dashboard.helpers.config.setValue(dashboard.widgetConfig.showPlaceName, true),
        showMinMaxTemp: dashboard.helpers.config.setValue(dashboard.widgetConfig.showMinMaxTemp, true),
        showSunrise: dashboard.helpers.config.setValue(dashboard.widgetConfig.showSunrise, false),
        showSunset: dashboard.helpers.config.setValue(dashboard.widgetConfig.showSunset, false),
    };

    var _position;

    var _dom = {
        widgetContainer: document.querySelector('#' + dashboard.container.id + ' [data-widget-weather]')
    };

    function _getUserLocation() {
        dashboard.helpers.getLocation({
            options : {
                enableHighAccuracy : true,
                timeout : 10000, //10 seconds
                maximumAge : 0 //spec default is 0
            },
            completeCallback: function(position) {
                _position = position;
                _weatherAPIRequest();
            }
        });
    }

    function _weatherAPIRequest() {
        dashboard.helpers.asyncRequest({
            method: 'GET',
            type: 'json',
            uri: 'http://api.openweathermap.org/data/2.5/weather?lat=' + _position.coords.latitude + '&lon=' + _position.coords.longitude + '&units=' + _config.apiFormatString + '&type=accurate'
        }).then(function(response){
            _renderWeatherUI(response);
        })
    }

    function _renderWeatherUI(response){
        //sunrise / sunset use epoch timestamp
        //http://www.epochconverter.com
        //epoch date -> JS date = new Date(epochDate * 1000)
        //JS date -> epoch date = Date.getTime()/1000.0

        var html = [];

        if(_config.showPlaceName){
            html.push('<div class="weather-location">' + response.name +', ' + response.sys.country +'</div>');
        }

        html.push('<div class="weather-data weather-data--primary">' + response.main.temp_max.toFixed(0) + formatStringHTML(_config.formatString) + '</div>');

        if(_config.showMinMaxTemp){
            html.push('<div class="weather-data weather-data--secondary">Max: ' + response.main.temp_max.toFixed(0) + formatStringHTML(_config.formatString) + '</div>');
            html.push('<div class="weather-data weather-data--secondary">Min: ' + response.main.temp_min.toFixed(0) + formatStringHTML(_config.formatString) + '</div>');
        }

        if(_config.showSunrise){
            html.push('<div class="weather-data weather-data--secondary">Sunrise: ' + timeToString(new Date(response.sys.sunrise * 1000))  + '</div>');
        }

        if(_config.showSunset){
            html.push('<div class="weather-data weather-data--secondary">Sunset: ' + timeToString(new Date(response.sys.sunset * 1000)) + '</div>');
        }

        _dom.widgetContainer.innerHTML = html.join('');

        function formatStringHTML(format) {
            return '<sup class="weather-data temp-format">' + format + '</sup>';
        }

        function timeToString(date){
            var hour = (date.getHours() <= 9) ? '0' + date.getHours() : date.getHours(),
                mins = (date.getMinutes() <= 9) ? '0' + date.getMinutes() : date.getMinutes();

            return hour + ':' + mins;
        }
    }

    function _loadingUIMessage(){
        _dom.widgetContainer.innerHTML = '<div class="loading-message">Getting today\'s weather</div>';
    }

    var exports = {};

    exports.init = function() {
        _loadingUIMessage();
        _getUserLocation();
    };

    return exports;
}
