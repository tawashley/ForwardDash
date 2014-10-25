function WidgetManager() {

    var _dashboardRows = [];
    var _container = document.getElementById('_widget-container_');
    var _widgetManagerScript = document.getElementById('WidgetManagerScript');
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

        //when all promises have been resolved (or are no longer pending)
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
                config: widget.getConfig(),
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

    exports.setLoadingMessage = function(message) {
        var html = [];

        html.push('<div class="loading-message" id="dashboard-loading-message">' + message + '</div>');
        document.getElementsByTagName('body')[0].insertAdjacentHTML('afterbegin', html.join(''));

        _setLoadingMessage = true;
    };

    return exports;
}
