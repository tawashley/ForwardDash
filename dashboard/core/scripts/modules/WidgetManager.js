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
