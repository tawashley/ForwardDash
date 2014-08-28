document.addEventListener("DOMContentLoaded", function(){
    var Manager = WidgetManager();

    //@TODO figure out have to pass config from registerWidget into the widget object;
    Manager.registerWidget({
        name: 'ClockWidget',
        size: 'small',
        config : {
            showSeconds: false,
            // showTimeOfDayIcon: false,
            // showDate: false,
           // TwelvehourClock: true
        }
    })

    Manager.renderWidgets();

}, false);