function CurrentWeatherWidget(config, helpers) {

    // var _config = {
    //     showDate: ((config.showDate !== undefined) ? config.showDate : true),
    // };

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
            //metric = degrees c
            //imperial = fahrenheight
            uri: 'http://api.openweathermap.org/data/2.5/weather?lat=' + _position.coords.latitude + '&lon=' + _position.coords.longitude + '&units=metric'
        }, function(response){
            _renderWeatherUI(response);
        });
    }

    function _renderWeatherUI(response){
        console.log(response);

        var html = [];

        html.push('<div class="weather-data max-temp">Current Temperature: ' + response.main.temp_max.toFixed(0) + '</div>');
        html.push('<div class="weather-data max-temp">Max Temp: ' + response.main.temp_max.toFixed(0) + '</div>');
        html.push('<div class="weather-data min-temp">Min Temp: ' + response.main.temp_min.toFixed(0) + '</div>');

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