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

    var CSSClassPrefix = 'widget--';
    var CSSIDPrefix = 'Widget';
    var CSSPositionClass = ((widget.position !== undefined) ? ' ' + CSSClassPrefix + widget.position : ' ' + CSSClassPrefix + 'left' );
    var CSSSizeClass = ((widget.size !== undefined) ? ' ' + CSSClassPrefix + widget.size : '');

    var name = widget.name;
    var config = widget.config;

    //random number between 1 and 10,000ß
    var widgetID = (Math.floor(Math.random() * 10000) + 1);
    var HTMLID = CSSIDPrefix + widgetID + '-' + name;
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

    exports.getHTMLID = function(){
        return HTMLID;
    };

    exports.CSS = {
        getpositionClass: function() {
            return CSSPositionClass;
        },

        getsizeClass: function() {
            return CSSSizeClass;
        }
    };

    return exports;
}
function WidgetHelpers(){
    var exports = {};

    exports.config = {
        setValue: function(value, default_value){
            return ((value !== undefined) ? value : default_value);
        },
        isUndefined: function(value){
            return (value === undefined);
        }
    };

    exports.date = {
        getDayString: function(day_number, short_day){
            var days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
            var shortDays = ['Sun', 'Mon', 'Tues', 'Wed', 'Thurs', 'Fri', 'Sat'];

            if(short_day){
                return shortDays[day_number];
            }

            return days[day_number];
        },
        getMonthString: function(month_number, short_month){
            var months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
            var shortMonths = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'June', 'July', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'];

            if(short_month){
                return shortMonths[month_number];
            }

            return months[month_number];
        }
    };

    exports.asyncRequest = function(data, callback) {
        var xhr = new XMLHttpRequest();

        xhr.open(data.method, data.uri, (data.async !== undefined) ? data.async : true);

        xhr.onreadystatechange = function() {
            if (this.readyState !== 4 || this.status !== 200){
                return;
            }

            if(typeof callback === 'function'){
                callback((data.type === 'json') ? JSON.parse(this.responseText) : this.responseText);
            }
        };

        xhr.send();
    };

    exports.getLocation = function(data) {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(function(position){
                data.completeCallback(position);
            }, function(error){

                var message;

                switch(error.code)
                {
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

                if(typeof data.errorCallback === 'function'){
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
    var _dashboardRows = [],
        _container = document.getElementById('_widget-container_'),
        _widgetManagerScript = document.getElementById('WidgetManagerScript'),
        _widgetCount = 0,
        _count = 0,
        _setLoadingMessage = false;

    var helpers = WidgetHelpers();
    var exports = {};

    function _initialiseRows() {
        _dashboardRows.forEach(function(row, index){
            _renderRow(row);
        });
    }

    function _renderRow(row) {

        var html = [];
        var widgetCount = row.widgets.length;
        var count = 0;
        var _widget;

        html.push('<div class="widget-row" id="' + row.name + '">');

        row.widgets.forEach(function(widget, index){
            _widgetCount++;

            _XHRWidgetHTML(widget, function(response){
                html.push(_renderWidgetHTML(response, widget));
            });

            count++;
        });

        html.push('</div>');

        if(count === widgetCount){
            _container.insertAdjacentHTML('beforeend', html.join(''));

            row.widgets.forEach(function(widget, index){
                widget.setElement();
                _loadScript(widget);
            });
        }

        if(_widgetCount === count){

            if(_setLoadingMessage){
                document.getElementById('dashboard-loading-message').parentElement.removeChild(document.getElementById('dashboard-loading-message'));
            }

            _container.classList.add('show');
        }

    }

    function _loadScript(widget) {
        var script = document.createElement('script');
        script.src = 'dashboard/widgets/' + widget.getName() + '/' + widget.getName() + '.js';

        script.onload = function(){

            window[widget.getName()]({
                container: widget.getElement(),
                config: widget.getConfig(),
                helpers: helpers
            }).init();
        };

        _widgetManagerScript.appendChild(script);
    }

    function _XHRWidgetHTML(widget, callback) {
        helpers.asyncRequest({
            method: 'GET',
            uri: '/dashboard/widgets/' + widget.getName() + '/' + widget.getName() + '.html',
            async: false
        }, function(response){
            callback(response);
        });
    }

    function _renderWidgetHTML(response, widget) {
        var html = [];

        html.push('<section class="widget' + widget.CSS.getsizeClass() + widget.CSS.getpositionClass()  + '" id="' + widget.getHTMLID() + '">');
        html.push(response);
        html.push('</section>');

        return html.join('');
    }

    function _getElement(widget){
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

    exports.setLoadingMessage = function(message) {
        var html = [];

        html.push('<div class="loading-message" id="dashboard-loading-message">' + message + '</div>');
        document.getElementsByTagName('body')[0].insertAdjacentHTML('afterbegin', html.join(''));

        _setLoadingMessage = true;
    };

    return exports;
}
