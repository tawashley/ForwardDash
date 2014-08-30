document.addEventListener("DOMContentLoaded", function(){
    var Manager = WidgetManager();

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
        size: 'medium',
        position: 'right',
        config: {
            celsius: true,
            // celsius: false (default)
            // showMinMaxTemp: false
        }
    })

    Manager.renderWidgets();

}, false);