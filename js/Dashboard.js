document.addEventListener("DOMContentLoaded", function(){
    var Manager = WidgetManager();

    //@TODO figure out have to pass config from registerWidget into the widget object;
    Manager.registerWidget({
        name: 'ClockWidget',
        size: 'small',
        config : {
            showSeconds: false
            // showTimeOfDayIcon: false
            // showDate: false

            // 24-hour of 12-hour clock
           //clockFormat: 24 || 12
        }
    })

    Manager.renderWidgets();

}, false);