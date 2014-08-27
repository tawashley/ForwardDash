function TestWidget() {

    var exports = {};

    function _bindEventListeners() {
        document.getElementById('TestWidgetContainer').addEventListener('click', function(){
            alert('you clicked on something');
        }, false);
    }

    exports.init = function() {
        console.log('hits init for TestWidget.js');
        _bindEventListeners();
    };

    return exports;
};