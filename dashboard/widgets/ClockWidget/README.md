# ClockWidget

> Widget to show the current time and date

## Usage

```js
var Manager = WidgetManager();

Manager.defineRow({
    widgets: [
        Widget({
            name: 'ClockWidget',
            config : {
                clock: {
                    //showSeconds: false,
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
    ]
})
```

## Config Properties
### Clock

#### showSeconds
Default: `true`

Show the seconds on the clock.

#### showTimeOfDayIcon
Default: `true`

Show the time of the day icon to the left of the clock.
There are four icons to correspond to early morning, morning, afternoon and evening.

#### TwelvehourClock
Default: `false`

Display the clock in 12-hour format, defaults to 24-hour

### Date

#### showDate
Default: `true`

Show the current date. Currently hardcoded to display in format of DD/MM/YYYY

#### showYear
Default: `true`

Show the current year at the end of the date

#### shortDay
Default: `false`

Display the day in a short format e.g Aug instead of August

#### shortMonth
Default: `false`

Display the month in a short format e.g. Sep instead of September