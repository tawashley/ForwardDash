function CurrentWeatherWidget() {

    //maybe look at having a wrapper function e.g. setConifg()
    //wrap around 'undefined' check

    // var _config = {
    //     showDate: ((config.showDate !== undefined) ? config.showDate : true),
    //     showSeconds: ((config.showSeconds !== undefined) ? config.showSeconds : true),
    //     showTimeOfDayIcon: ((config.showTimeOfDayIcon !== undefined) ? config.showTimeOfDayIcon : true),
    //     TwelvehourClock: ((config.TwelvehourClock !== undefined) ? config.TwelvehourClock : false)
    // };

    var exports = {};

    exports.init = function() {
        console.log('hits current weather widget init')
    };

    return exports;
};