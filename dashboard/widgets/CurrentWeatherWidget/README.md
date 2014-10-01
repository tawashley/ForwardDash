# CurrentWeatherWidget

> Widget to show the weather conditions (uses geolocation and Open Weather Map's API)

## Usage

```js
var Manager = WidgetManager();

Manager.defineRow({
    widgets: [
        Widget({
            name: 'CurrentWeatherWidget',
            config: {
                //celsius: true,
                //showMinMaxTemp: false,
                //showSunrise: false,
                //showSunset: true
            }
        })
    ]
})
```

## Config Properties

#### celsius
Default: `false`

Show the temperature in degree celsius. Default is to display in fahrenheit

#### showMinMaxTemp
Default: `true`

Show the minimum and maximum daily temperature for your current location

#### showSunrise
Default: `false`

Show the time of sunrise for your current location

#### showSunset
Default: `false`

Show the time of sunset for your current location