document.addEventListener('DOMContentLoaded', function(){
    var Manager = WidgetManager();

    Manager.setLoadingMessage('Loading dashboard widgets');

    Manager.defineRow({
        name: 'TopRow',
        widgets: [
            Widget({
                name: 'ClockWidget',
                size: 'half',
                config : {
                    clock: {
                        showSeconds: false,
                        flashHourMinuteSeperator: true
                        // showTimeOfDayIcon: false,
                        // TwelvehourClock: true
                    },
                    date: {
                        // showDate: true
                        // showYear: false
                        // shortDay: true
                        // shortMonth: true
                    }
                }
            }),
            Widget({
                name: 'CurrentWeatherWidget',
                position: 'right',
                config: {
                    celsius: true,
                    // celsius: false (default)
                    showMinMaxTemp: false,
                    // showSunrise: false,
                    // showSunset: true
                }
            })
        ]
    });

    Manager.defineRow({
        name: 'ForecastRow',
        widgets: [
            Widget({
                name: 'ForecastWidget',
                size: 'full',
                config: {
                    celsius: true,
                    // showTemp: false,
                    // showForecastDescription: false,
                    // hightlightTodaysForecast: false
                }
            })
        ]
    });

    Manager.renderWidgets();

}, false);

function Widget(widget){

    var name = widget.name;
    var config = ((widget.config !== undefined) ? widget.config : {});
    var widgetID = (Math.floor(Math.random() * 10000) + 1); //random number between 1 and 10,000

    var HTMLIDPrefix = 'Widget';
    var HTMLID = HTMLIDPrefix + widgetID + '-' + name;
    var HTMLClassPrefix = 'widget--';
    var HTMLPositionClass = ((widget.position !== undefined) ? ' ' + HTMLClassPrefix + widget.position : ' ' + HTMLClassPrefix + 'left' );
    var HTMLSizeClass = ((widget.size !== undefined) ? ' ' + HTMLClassPrefix + widget.size : '');
    var DOMElement;

    var exports = {};

    exports.setElement = function(){
        DOMElement = document.getElementById(HTMLID);
    };

    exports.getName = function(){
        return name;
    };

    exports.getConfig = function(){
        return config;
    };

    exports.getElement = function(){
        return DOMElement;
    };

    exports.getWidgetID = function(){
        return widgetID;
    };

    exports.getHTMLID = function(){
        return HTMLID;
    };

    exports.HTML = {
        getpositionClass: function() {
            return HTMLPositionClass;
        },

        getsizeClass: function() {
            return HTMLSizeClass;
        },

        getID: function(){
            return HTMLID;
        }
    };

    return exports;
}

function WidgetHelpers() {
    var exports = {};

    exports.config = {
        setValue: function(value, default_value) {
            return ((value !== undefined) ? value : default_value);
        },
        isUndefined: function(value) {
            return (value === undefined);
        },
    };

    exports.date = {
        getDayString: function(day_number, short_day) {
            var days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
            var shortDays = ['Sun', 'Mon', 'Tues', 'Wed', 'Thurs', 'Fri', 'Sat'];

            if (short_day) {
                return shortDays[day_number];
            }

            return days[day_number];
        },
        getMonthString: function(month_number, short_month) {
            var months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
            var shortMonths = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'June', 'July', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'];

            if (short_month) {
                return shortMonths[month_number];
            }

            return months[month_number];
        }
    };

    exports.isEmptyObject = function(object) {
        return Object.keys(object).length === 0;
    };

    exports.asyncRequest = function(data) {
        return new Promise(function(resolve, reject) {
            var request = new XMLHttpRequest();
            request.open(data.method, data.uri);
            request.onload = function() {
                if (request.status === 200) {
                    resolve((data.type === 'json') ? JSON.parse(request.response) : request.response);
                } else {
                    reject(Error(request.statusText));
                }
            };
            request.onerror = function() {
                reject(Error('Error fetching data.'));
            };
            request.send();
        });
    };

    exports.getLocation = function(data) {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(function(position) {
                data.completeCallback(position);
            }, function(error) {

                var message;

                switch (error.code) {
                    case error.PERMISSION_DENIED:
                        console.warn('Geolocation Error - User denied the request for Geolocation.');
                        message = 'User Permission was not given';
                        break;
                    case error.POSITION_UNAVAILABLE:
                        console.warn('Geolocation Error - Location information is unavailable.');
                        message = 'Your device was unable to get your location';
                        break;
                    case error.TIMEOUT:
                        console.warn('Geolocation Error - The request to get user location timed out.');
                        message = 'Location request timed out';
                        break;
                    case error.UNKNOWN_ERROR:
                        console.warn('Geolocation Error - An unknown error occurred.');
                        message = 'An unknown error occured';
                        break;
                }

                console.log(error);

                if (typeof data.errorCallback === 'function') {
                    data.errorCallback(message, error);
                }

            }, data.options);
        } else {
            console.warn('You browser does not support geolocation');
        }
    };

    return exports;
}

function WidgetManager() {

    var _dashboardRows = [];
    var _container = document.getElementById('ForwardDash');
    var _widgetManagerScript = document.getElementById('ForwardDashScript');
    var _setLoadingMessage = false;

    var helpers = WidgetHelpers();
    var exports = {};

    function _initialiseRows() {
        _dashboardRows.forEach(function(row, index) {
            _renderRow(row);
        });
    }

    function _renderRow(row) {

        var html = [];
        var promises = [];

        html.push('<div class="widget-row" id="' + row.name + '">');

        for (var i = row.widgets.length - 1; i >= 0; i--) {
            promises.push(_getWidgetHTML(row.widgets[i]));
        }

        Promise.all(promises).then(function(data) {

            html.push(data.join(''));
            html.push('</div>');
            _container.insertAdjacentHTML('beforeend', html.join(''));

            _setupWidgets(row);

            if (_setLoadingMessage) {
                document.getElementById('dashboard-loading-message').parentElement.removeChild(document.getElementById('dashboard-loading-message'));
            }

            _container.classList.add('show');
        });
    }

    function _setupWidgets(row) {
        row.widgets.forEach(function(widget, index) {
            widget.setElement();
            _loadScript(widget);
        });
    }

    function _getWidgetHTML(widget) {
        return new Promise(function(resolve, reject) {
            var request = new XMLHttpRequest();
            request.open('GET', '/dashboard/widgets/' + widget.getName() + '/' + widget.getName() + '.html');
            request.onload = function() {
                if (request.status === 200) {
                    resolve(_renderWidgetHTML(request.response, widget));
                } else {
                    reject(Error(request.statusText));
                }
            };

            request.onerror = function() {
                reject(Error('Error fetching data.'));
            };

            request.send();
        });
    }

    function _loadScript(widget) {
        var script = document.createElement('script');
        script.src = 'dashboard/widgets/' + widget.getName() + '/' + widget.getName() + '.js';

        script.onload = function() {
            window[widget.getName()]({
                container: widget.getElement(),
                widgetConfig: widget.getConfig(),
                helpers: helpers
            }).init();
        };

        _widgetManagerScript.appendChild(script);
    }

    function _renderWidgetHTML(response, widget) {
        var html = [];

        html.push('<section class="widget' + widget.HTML.getsizeClass() + widget.HTML.getpositionClass() + '" id="' + widget.getHTMLID() + '">');
        html.push(response);
        html.push('</section>');

        return html.join('');
    }

    function _getElement(widget) {
        return document.getElementById(widget.getHTMLID());
    }


    exports.defineRow = function(data) {
        _dashboardRows.push({
            name: data.name,
            widgets: data.widgets
        });
    };

    exports.renderWidgets = function() {
        _initialiseRows();
    };

    exports.getRows = function() {
        return _dashboardRows;
    };

    exports.setLoadingMessage = function(message) {
        var html = [];

        html.push('<div class="loading-message" id="dashboard-loading-message">' + message + '</div>');
        document.getElementsByTagName('body')[0].insertAdjacentHTML('afterbegin', html.join(''));

        _setLoadingMessage = true;
    };

    return exports;
}

function ClockWidget(dashboard) {

    if(dashboard.helpers.isEmptyObject(dashboard.widgetConfig)){
        dashboard.widgetConfig.date = {};
        dashboard.widgetConfig.clock = {};
    }

    var _config = {
        clock: {
            showSeconds: dashboard.helpers.config.setValue(dashboard.widgetConfig.clock.showSeconds, true),
            flashHourMinuteSeperator: dashboard.helpers.config.setValue(dashboard.widgetConfig.clock.flashHourMinuteSeperator, false),
            showTimeOfDayIcon: dashboard.helpers.config.setValue(dashboard.widgetConfig.clock.showTimeOfDayIcon, true),
            TwelvehourClock: dashboard.helpers.config.setValue(dashboard.widgetConfig.clock.TwelvehourClock, false),
            hexColour: dashboard.helpers.config.setValue(dashboard.widgetConfig.clock.hexColour, false)
        },
        date : {
            showDate: dashboard.helpers.config.setValue(dashboard.widgetConfig.date.showDate, true),
            showYear: dashboard.helpers.config.setValue(dashboard.widgetConfig.date.showYear, true),
            shortDay: dashboard.helpers.config.setValue(dashboard.widgetConfig.date.shortDay, false),
            shortMonth: dashboard.helpers.config.setValue(dashboard.widgetConfig.date.shortMonth, false)
        }
    };

    var _dom = {
        container: dashboard.container,
        clock: document.querySelector('#' + dashboard.container.id + ' [data-widget-clock]'),
        date: document.querySelector('#' + dashboard.container.id + ' [data-widget-date]'),
    };

    var _tickTock = 1;

    var exports = {};

    function _render_date(){
        var html = [],
            date = new Date();

        html.push('<span class="date-section date-day">' + dashboard.helpers.date.getDayString(date.getDay()) + '</span>');
        html.push('<span class="date-section date-date">' + date.getDate() + '</span>');
        html.push('<span class="date-section date-month">' + dashboard.helpers.date.getMonthString(date.getMonth()) + '</span>');

        if(_config.date.showYear){
            html.push('<span class="date-section date-year">' + date.getFullYear() + '</span>');
        }

        _dom.date.innerHTML = html.join('');

        setTimeout(_render_date, 100000);
    }

    function _render_time(){
        var html = [],
            date = new Date(),
            hour = (date.getHours() <= 9) ? '0' + date.getHours() : date.getHours(),
            mins = (date.getMinutes() <= 9) ? '0' + date.getMinutes() : date.getMinutes(),
            seconds = (date.getSeconds() <= 9) ? '0' + date.getSeconds() : date.getSeconds(),
            hex = '#' + hour + mins + seconds,
            pmAm = (hour > 12) ? 'pm' : 'am';

        if(_config.clock.hexColour){
            _dom.container.style.backgroundColor = hex;
        }

        if(_config.clock.showTimeOfDayIcon){
            html.push('<div class="clock-section clock-icon"><i class="icon '  + getTimeOfDayIcon(hour) + '"></i></div>');
        }

        if(_config.clock.TwelvehourClock && hour > 12){
            hour = (hour - 12);
        }

        html.push('<div class="clock-section clock-time">');
        html.push('<span class="clock-hours">' + hour + getClockSeperator() + '</span>');
        html.push('<span class="clock-mins">' + mins + '</span>');

        if(_config.clock.showSeconds){
            html.push('<span class="clock-seconds">&#58;' + seconds + '</span>');
        }

        if(_config.TwelvehourClock){
            html.push('<span class="clock-pm-am">' + pmAm + '</div>');
        }

        html.push('</div>');

        _dom.clock.innerHTML = html.join('');

        //setTimeout(_render_time, 1000);

        function getTimeOfDayIcon(hour) {
            if(hour > 0 && hour < 8){
                return 'icon-morning';
            } else if(hour > 07 && hour < 13) {
                return 'icon-sunny';
            } else if (hour > 12 && hour < 19){
                return 'icon-afternoon';
            } else if (hour > 18 && hour <= 23) {
                return 'icon-evening';
            }
        }

        function getClockSeperator() {

            var html = [];

            html.push('<span class="clock-seperator' + ((_config.clock.flashHourMinuteSeperator) ? 'clock-seperator--flashing' : '') + '">');

            if (!_config.clock.flashHourMinuteSeperator || _tickTock){
                html.push('&#58;'); //colon
            } else {
                html.push('&nbsp;') //space
            }

            html.push('</span>');

            _tickTock = !_tickTock;

            return html.join('');
        }
    }

    exports.init = function() {
        _render_time();

        if(_config.date.showDate){
            _render_date();
        }
    };

    return exports;
}

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
