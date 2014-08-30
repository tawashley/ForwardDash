document.addEventListener("DOMContentLoaded", function(){
    var Manager = WidgetManager();

    //@TODO LOOK AT MAKING EACH WIDGET IT'S OWN WEB WORKER - PSUEDO THREADING

    Manager.registerWidget({
        name: 'ClockWidget',
        size: 'small',
        config : {
            clock: {
                showSeconds: false,
                // showTimeOfDayIcon: false,
                // TwelvehourClock: true
            },
            date: {
                // showDate: true
                // showYear: false
                // shortDay: true
                // shortMonth: true
            }
        }
    })

    Manager.registerWidget({
        name: 'CurrentWeatherWidget',
        position: 'right',
        config: {
            celsius: true,
            // celsius: false (default)
            showMinMaxTemp: false,
            // showSunrise: false,
            showSunset: true
        }
    })

    Manager.renderWidgets();

}, false);