function WidgetManager() {
    var _widgets = [],
        _id_count = 1,
        _id_prefix = "W-000",
        _container = document.getElementById('_widget-container_'),
        _count = 1;

    var exports = {};

    function _initialiseWidgets() {
        _widgets.forEach(function(widget, index){
            _XHRWidgetHTML(widget);
        });
    };

    function _loadScript(widget) {
        var script = document.createElement('script');
        script.src = 'js/widgets/' + widget.name + '/' + widget.name + 'Main.js';

        script.onload = function(){
            //@TODO get rid of eval eventually!
            eval(widget.name + "().init()");
        }

        document.getElementById('WidgetManagerScript').appendChild(script);
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

        html.push('<section class="widget widget--' + widget.size + '" id="' + widget.name + 'Container">');
        html.push(response);
        html.push('</section>');

        _container.insertAdjacentHTML('afterbegin', html.join(''));

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

    exports.render = function() {
        _initialiseWidgets();
    };

    return exports;
};