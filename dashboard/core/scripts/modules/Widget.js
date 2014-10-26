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
    }

    exports.getHTMLID = function(){
        return HTMLID;
    };

    exports.HTML = {
        getpositionClass: function() {
            return HTMLPositionClass;
        },

        getsizeClass: function() {
            return HTMLSizeClass;
        }
    };

    return exports;
}
