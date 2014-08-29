document.addEventListener("DOMContentLoaded", function(){
    var Manager = WidgetManager();

    Manager.registerWidget({
        name: 'ClockWidget',
        size: 'small',
        config : {
            showSeconds: false,
            // showTimeOfDayIcon: false,
            // showDate: false,
           // TwelvehourClock: true
           // showYear: false
           // shortDay: true,
           // shortMonth: true

           //shortYear: true
        }
    })

    Manager.registerWidget({
        name: 'CurrentWeatherWidget',
        size: 'medium',
        position: 'right'
    })

    Manager.renderWidgets();

}, false);