document.addEventListener("DOMContentLoaded", function(){
    var Manager = WidgetManager();

    Manager.registerWidget({
        name: 'ClockWidget',
        size: 'small'
    })

    Manager.render();

}, false);