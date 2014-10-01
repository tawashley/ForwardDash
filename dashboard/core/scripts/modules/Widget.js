function Widget(widget){

    var CSSClassPrefix = 'widget--';
    var CSSIDPrefix = 'Widget';
    var CSSPositionClass = ((widget.position !== undefined) ? ' ' + CSSClassPrefix + widget.position : ' ' + CSSClassPrefix + 'left' );
    var CSSSizeClass = ((widget.size !== undefined) ? ' ' + CSSClassPrefix + widget.size : '');

    var name = widget.name;
    var config = ((widget.config !== undefined) ? widget.config : {});

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