# Dashed

> Widget powered web based dashboard using HTML, CSS and JS

A Web Dashboard built using widgets - built with a focus on the developer, allowing freedom of structure and behavior with the look and feel being controlled programatically.

There are currently three default widgets

* ClockWidget
* CurrentWeatherWidget
* ForecastWeatherWidget

Widgets are designed to be modular, having their own markup, style
s and behaviour and with the ability to make easily configurable. Don't need seconds to be displayed on the clock, flip the config flag.

Once all desired widgets have been added to the dashboard directory, a simple script defining the User Interface and the Widgets to include is all that is needed.

When defining individual widgets, global options can be set such as the size of the widget and the position can be as well as the config object for the widget to interact with.

## Getting Started

Getting a single widget dashboard up and running is super quick. All is needed is a HTML document and a script file to get the ball rolling.

index.html

```html
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Dashboard</title>
</head>

<body>
    <div id="_widget-container_" class="_widget-container_"></div>
</body>

<!-- common widget helpers -->
<script src="/dashboard/WidgetHelpers.js"></script>

<!-- widget manager responsible for all the heavy lifting -->
<!-- id is required and should not be changed -->
<script src="/dashboard/WidgetManager.js" id="WidgetManagerScript"></script>

<!-- script that brings it all together-->
<script src="/dashboard/main.js"></script>

</html>
```

main.js
```js
document.addEventListener("DOMContentLoaded", function(){

    //instantiate the dashboard handler
    var Manager = WidgetManager();

    Manager.defineRow({
        widgets: [
            {
                //this must be the same as the widget folder
                name: 'ClockWidget'
            }
        ]
    })

    //commit all additions and render widgets on-screen
    Manager.renderWidgets();

}, false);
```

The defineRow() function accepts an object with one key being an array of objects for each widget of that row. The minimum required data for a widget to work is it's name (the exact name of the widget's folder name)

## Adding more widgets

More widgets and rows with widgets can easily be added by expanding the widgets array.

```js
Manager.defineRow({
    name: 'ClockAndDate',
    widgets: [
        {
            name: 'ClockWidget',
            size: 'half',
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
        },
        {
            name: 'CurrentWeatherWidget',
            position: 'right',
            config: {
                celsius: true,
                showMinMaxTemp: false,
                // showSunrise: false,
                showSunset: true
            }
        }
    ]
})

Manager.defineRow({
    name: 'ForecastRow',
    widgets: [
        {
            name: 'ForecastWidget',
            size: 'full',
            config: {
                celsius: true,
                // showTemp: false,
                // showForecastDescription: false,
                // hightlightTodaysForecast: false
            }
        }
    ]
})
```

The above code will render the 'ClockWidget' and 'CurrentWeatherWidget' as one row and the 'ForecastWidget' on the row below it. When adding a widget extra properties can be also be provided such as 'position' its 'size' (how much space it takes up of the row). A config object that is exposed to the widget script can also be defined here and allows for control over the display and behaviour of any given widget.

## Creating a new widget

All widgets are stored in the 'dashboard/widgets' directory and individual widgets have their own folder containing one HTML, CSS and JS files namespaced with the widget name.

For example, all code for a widget called 'FooBar' would be in a folder called 'FooBarWidget' ('Widget' and a suffix is required to work) and may contain the files:

* FooBarWidget.html - structure
* FooBarWidget.css - appearance
* FooBarWidget.js - behaviour

This strucutre can be seen for the default dashboard widgets.

## Current Limitations

@TODO limitations