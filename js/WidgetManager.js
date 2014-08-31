function WidgetManager() {
    var _widgets = [],
        _container = document.getElementById('_widget-container_'),
        _widgetManagerScript = document.getElementById('WidgetManagerScript')
        _count = 1;
        _dashboardRows = [];

    var helpers = WidgetHelpers();
    var exports = {};

    function _initialiseWidgets() {
        _widgets.forEach(function(widget, index){
            _XHRWidgetHTML(widget);
        });
    };

    function _initialiseRows() {
        _dashboardRows.forEach(function(row, index){
            _renderRow(row);
        })
    }

    function _renderRow(row) {
        var html = [];

        var widgetCount = row.widgets.length;

        var count = 0;

        html.push('<div class="widget-row" id="' + row.name + '" >');

        row.widgets.forEach(function(widget, index){
            _XHRWidgetHTML(widget, function(response){
                html.push(_renderWidgetHTML(response, widget));
            });

            count++;

            if(count === widgetCount){
                console.log('looped through all widgets');
            }
        })

        html.push('</div>');

        if(count === widgetCount){
            console.log(html);

            _container.insertAdjacentHTML('beforeend', html.join(''));

            row.widgets.forEach(function(widget, index){
                _loadScript(widget);
            })
        }

    }

    function _loadScript(widget) {
        var script = document.createElement('script');
        script.src = 'js/widgets/' + widget.name + '/' + widget.name + '.js';

        script.onload = function(){
            window[widget.name](widget.config, helpers).init();
        }

        _widgetManagerScript.appendChild(script);
    }

    function _XHRWidgetHTML(widget, callback) {
        helpers.asyncRequest({
            method: 'GET',
            uri: '/js/widgets/'+ widget.name + '/' + widget.name + '.html',
            async: false
        }, function(response){
            callback(response);
        })
    }

    function _renderWidgetHTML(response, widget) {
        var html = [];

        html.push('<section class="widget' + _getWidgetSizeClass(widget) + _getWidgetPositionClass(widget) +'" id="' + widget.name + 'Container">');
        html.push(response);
        html.push('</section>');

        return html.join('');
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

    exports.defineRow = function(data) {
        _dashboardRows.push({
            name: data.name,
            widgets: data.widgets
        });
    }

    exports.renderWidgets = function() {
        // _initialiseWidgets();
        _initialiseRows();
    };

    return exports;
};
