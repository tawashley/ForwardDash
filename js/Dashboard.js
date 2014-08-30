document.addEventListener("DOMContentLoaded", function(){
    var Manager = WidgetManager();

    //for navigation issues thinkings of maybe defining row when registering a Widget
    //so when defining a widget you would also defined where it would be added to in the DOM a la the row

    //it could be added in a way such as

    //Manager.defineRow({'rowName': 'boo', Manager.registerWidget{...}) or something

    //something to clearly define what widgets are on what row and how they are seperated on the UI etc.


/*    Manager.defineRow({
        name: 'nameOfTheRow',
        widgets: [
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
            }),
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
        ]
    })*/

    Manager.registerWidget({
        name: 'ClockWidget',
        size: 'small',
        config : {
            clock: {
                showSeconds: false,
                showTimeOfDayIcon: false,
                TwelvehourClock: true
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