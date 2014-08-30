function WidgetManager() {
    var _widgets = [],
        _id_count = 1,
        _id_prefix = "W-000",
        _container = document.getElementById('_widget-container_'),
        _widgetManagerScript = document.getElementById('WidgetManagerScript')
        _count = 1;

    var helpers = WidgetHelpers();

    var exports = {};

    function _initialiseWidgets() {
        _widgets.forEach(function(widget, index){
            _XHRWidgetHTML(widget);
        });
    };

    function _loadScript(widget) {
        var script = document.createElement('script');
        script.src = 'js/widgets/' + widget.name + '/' + widget.name + '.js';

        script.onload = function(){
            window[widget.name](widget.config, helpers).init();
        }

        _widgetManagerScript.appendChild(script);
    }

    function _XHRWidgetHTML(widget) {
        var xhr = new XMLHttpRequest();

        xhr.open('GET', '/js/widgets/'+ widget.name + '/' + widget.name + '.html', true);

        xhr.onreadystatechange= function() {
            if (this.readyState !== 4 || this.status !== 200){
                return;
            }

            _renderWidgetHTML(this.responseText, widget)
        };

        xhr.send();
    }

    function _renderWidgetHTML(response, widget) {
        var html = [];

        html.push('<section class="widget widget--' + widget.size + ' widget--'+ ((widget.position !== undefined) ? widget.position : 'left' ) +'" id="' + widget.name + 'Container" data-widget-id="' + widget.id + '">');
        html.push(response);
        html.push('</section>');

        _container.insertAdjacentHTML('beforeend', html.join(''));

        _loadScript(widget);

        if(_count == _widgets.length){
            _container.classList.add('show');
        }

        _count++;
    }

    exports.registerWidget = function(widget) {
        widget.id = _id_prefix + _id_count;

        _widgets.push(widget);

        _id_count++;
    };

    exports.getWidgets = function() {
        return _widgets;
    };

    exports.renderWidgets = function() {
        _initialiseWidgets();
    };

    return exports;
};

function WidgetHelpers(){
    var exports = {};

    exports.config = {
        setValue: function(value, default_value){
            return ((value !== undefined) ? value : default_value);
        },
        isUndefined: function(value){
            return (value === undefined);
        }
    }

    exports.asyncRequest = function(data, callback) {
        var xhr = new XMLHttpRequest();

        xhr.open(data.method, data.uri, true);

        xhr.onreadystatechange = function() {
            if (this.readyState !== 4 || this.status !== 200){
                return;
            }

            if(typeof callback == 'function'){
                callback((data.type === 'json') ? JSON.parse(this.responseText) : this.responseText);
            }
        };

        xhr.send();
    }

    exports.getLocation = function(data) {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(function(position){
                data.completeCallback(position);
            }, function(error){

                var message;

                switch(error.code)
                {
                    case error.PERMISSION_DENIED:
                        console.warn("Geolocation Error - User denied the request for Geolocation.");
                        message = 'User Permission was not given';
                        break;
                    case error.POSITION_UNAVAILABLE:
                        console.warn("Geolocation Error - Location information is unavailable.");
                        message = 'Your device was unable to get your location';
                        break;
                    case error.TIMEOUT:
                        console.warn("Geolocation Error - The request to get user location timed out.");
                        message = 'Location request timed out';
                        break;
                    case error.UNKNOWN_ERROR:
                        console.warn("Geolocation Error - An unknown error occurred.");
                        message = 'An unknown error occured';
                        break;
                }

                console.log(error);

                if(typeof data.errorCallback == 'function'){
                    data.errorCallback(message, error);
                }

            }, data.options);
        } else {
            console.warn('You browser does not support geolocation');
        }
    }

    return exports;
}

