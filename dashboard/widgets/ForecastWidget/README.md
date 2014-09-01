# ForecastWidget

> Widget to show the 7-day forecast (uses geolocation and Open Weather Map's API)

## Usage

```js
var Manager = WidgetManager();

Manager.defineRow({
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

## Config Properties

#### celsius
Default: `false`

Show the temperature in degree celsius. Default is to display in fahrenheit

#### showTemp
Default: `true`

Show the temperature for each day's forecast

#### showForecastDescription
Default: `true`

Show a description for each day's forecast e.g 'Cloudy'

#### hightlightTodaysForecast
Default: `true`

Highlight the current day's forecast on the UI