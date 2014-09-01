# web-dashboard

> Widget powered web based dashboard using HTML, CSS and JS

A Web Dashboard built for developing - allowing information to be shown as widgets.
There are currently three default widgets

* ClockWidget
* CurrentWeatherWidget
* ForecastWeatherWidget

Widgets are designed to be modular, having their own markup, styles and behaviour and with the ability to make easily configurable. Don't need seconds to be displayed on the clock, flip the config flag.

Once all desired widgets have been added to the dashboard directory, a simple script defining the User Interface and the Widgets to include is all that is needed.

When defining individual widgets, global options can be set such as the size of the widget and the position can be as well as the config object for the widget to interact with.

## Creating and using dashboard widgets

All widgets are stored in the 'dashboard/widgets' directory and individual widgets have their own folder containing HTML, CSS and JS files namespaced as the widget name.

For example, all code for a widget called 'FooBar' would be in a folder called 'FooBarWidget' ('Widget' and a suffix is required to work) and would contain the file:

* FooBarWidget.html - structure
* FooBarWidget.css - appearance
* FooBarWidget.js - behaviour

This strucutre can be seen for the default dashboard widgets