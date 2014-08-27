document.addEventListener("DOMContentLoaded", function(){
    var Manager = WidgetManager();

    Manager.registerWidget({
        name: 'TestWidget',
        size: 'small'
    })

    Manager.registerWidget({
        name: 'TestWidget2',
        size: 'full'
    })

    Manager.render();

}, false);