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

        html.push('<section class="widget' + _getWidgetSizeClass(widget) + _getWidgetPositionClass(widget) +'" id="' + widget.name + 'Container" data-widget-id="' + widget.id + '">');
        html.push(response);
        html.push('</section>');

        _container.insertAdjacentHTML('beforeend', html.join(''));

        _loadScript(widget);

        if(_count == _widgets.length){
            _container.classList.add('show');
        }

        _count++;
    }

    function _getWidgetPositionClass(widget){
        return ((widget.position !== undefined) ? ' widget--' + widget.position : ' widget--left' )
    }

    function _getWidgetSizeClass(widget){
        return ((widget.size !== undefined) ? ' widget--' + widget.size : ' widget--left' )
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
