function CurrentWeatherWidget(config, helpers) {

    //maybe look at having a wrapper function e.g. setConifg()
    //wrap around 'undefined' check

    // var _config = {
    //     showDate: ((config.showDate !== undefined) ? config.showDate : true),
    // };

    function _getUserLocation() {
        helpers.getLocation({
            options : {
                enableHighAccuracy : true,
                timeout : 10000, //milliseconds
                maximumAge : 0 // spec default is 0
            },
            completeCallback: function(position) {
                _weatherAPIRequest(position);
            }
        })
    }

    function _weatherAPIRequest(position) {
        helpers.asyncRequest({
            method: 'GET',
            type: 'json',
            uri: 'http://api.openweathermap.org/data/2.5/weather?lat=' + position.coords.latitude + '&lon=' + position.coords.longitude
        }, function(response){
            console.log(response);
        });
    }

    var exports = {};

    exports.init = function() {
        _getUserLocation();
    };

    return exports;
};