document.addEventListener('DOMContentLoaded', function(){
    var Manager = WidgetManager();

    Manager.setLoadingMessage('Loading dashboard widgets');

    Manager.defineRow({
        name: 'TopRow',
        widgets: [
            Widget({
                name: 'ClockWidget',
                size: 'half',
                config : {
                    clock: {
                        showSeconds: false,
                        flashHourMinuteSeperator: true
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
            Widget({
                name: 'CurrentWeatherWidget',
                position: 'right',
                config: {
                    celsius: true,
                    // celsius: false (default)
                    showMinMaxTemp: false,
                    // showSunrise: false,
                    // showSunset: true
                }
            })
        ]
    });

    Manager.defineRow({
        name: 'ForecastRow',
        widgets: [
            Widget({
                name: 'ForecastWidget',
                size: 'full',
                config: {
                    celsius: true,
                    // showTemp: false,
                    // showForecastDescription: false,
                    // hightlightTodaysForecast: false
                }
            })
        ]
    });

    Manager.renderWidgets();

}, false);
