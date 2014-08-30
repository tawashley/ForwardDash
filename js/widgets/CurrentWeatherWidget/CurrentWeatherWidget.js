function CurrentWeatherWidget(config, helpers) {

    var _config = {
        celsius: helpers.config.setValue(config.celsius, false),
        formatString: ((config.celsius) ? '&#8451;' : '&#8457;'),
        apiFormatString: ((config.celsius) ? 'metric' : 'imperial')
    };

    console.log(_config);

    var _position;

    var _dom = {
        widgetContainer: document.getElementById('current-weather-container')
    }

    function _getUserLocation() {
        helpers.getLocation({
            options : {
                enableHighAccuracy : true,
                timeout : 10000, //milliseconds
                maximumAge : 0 // spec default is 0
            },
            completeCallback: function(position) {
                _position = position;
                _weatherAPIRequest();
            }
        })
    }

    function _weatherAPIRequest() {
        helpers.asyncRequest({
            method: 'GET',
            type: 'json',
            uri: 'http://api.openweathermap.org/data/2.5/weather?lat=' + _position.coords.latitude + '&lon=' + _position.coords.longitude + '&units=' + _config.apiFormatString + '&type=accurate'
        }, function(response){
            _renderWeatherUI(response);
        });
    }

    function _renderWeatherUI(response){
        console.log(response);

        var html = [];

        html.push('<div class="weather-data max-temp">Current Temperature: ' + response.main.temp_max.toFixed(0) + _config.formatString + '</div>');
        html.push('<div class="weather-data max-temp">Max Temp: ' + response.main.temp_max.toFixed(0) + _config.formatString + '</div>');
        html.push('<div class="weather-data min-temp">Min Temp: ' + response.main.temp_min.toFixed(0) + _config.formatString + '</div>');

        _dom.widgetContainer.innerHTML = html.join('');
    }

    function _loadingUIMessage(){
        _dom.widgetContainer.innerHTML = '<p>Getting weather data...</p>';
    }

    var exports = {};

    exports.init = function() {
        _loadingUIMessage();
        _getUserLocation();
    };

    return exports;
};