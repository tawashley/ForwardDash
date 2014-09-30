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

        html.push('<div class="widget-row"' + _getDashboardRowID(row.name) + '>');

        row.widgets.forEach(function(widget, index){
            _widgetCount++;

            //random number between 1 and 10,000
            widget.id = (Math.floor(Math.random() * 10000) + 1);

            _XHRWidgetHTML(widget, function(response){
                html.push(_renderWidgetHTML(response, widget));
            });

            count++;
        });

        html.push('</div>');

        if(count === widgetCount){
            _container.insertAdjacentHTML('beforeend', html.join(''));

            row.widgets.forEach(function(widget, index){
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
        script.src = 'dashboard/widgets/' + widget.name + '/' + widget.name + '.js';

        script.onload = function(){
            window[widget.name]({
                container: _getElement(widget),
                config: widget.config,
                helpers: helpers
            }).init();
        };

        _widgetManagerScript.appendChild(script);
    }

    function _XHRWidgetHTML(widget, callback) {
        helpers.asyncRequest({
            method: 'GET',
            uri: '/dashboard/widgets/'+ widget.name + '/' + widget.name + '.html',
            async: false
        }, function(response){
            callback(response);
        });
    }

    function _renderWidgetHTML(response, widget) {
        var html = [];

        html.push('<section class="widget' + _getWidgetSizeClass(widget) + _getWidgetPositionClass(widget) + '" id="' + _getHTMLID(widget) + '">');
        html.push(response);
        html.push('</section>');

        return html.join('');
    }

    function _getElement(widget){
        return document.getElementById(_getHTMLID(widget));
    }

    function _getHTMLID(widget) {
        return 'Widget' + widget.id + '-' + widget.name;
    }

    function _getDashboardRowID(name){
        return ((name !== undefined) ? 'id="' + name + '"': '');
    }

    function _getWidgetPositionClass(widget){
        return ((widget.position !== undefined) ? ' widget--' + widget.position : ' widget--left' );
    }

    function _getWidgetSizeClass(widget){
        return ((widget.size !== undefined) ? ' widget--' + widget.size : '' );
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

        html.push('<div class="loading-message" id="dashboard-loading-message">'+ message + '</div>');
        document.getElementsByTagName('body')[0].insertAdjacentHTML('afterbegin', html.join(''));

        _setLoadingMessage = true;
    };

    return exports;
}
