function ClockWidget(dashboard) {

    if(dashboard.helpers.isEmptyObject(dashboard.widgetConfig)){
        dashboard.widgetConfig.date = {};
        dashboard.widgetConfig.clock = {};
    }

    var _config = {
        clock: {
            showSeconds: dashboard.helpers.config.setValue(dashboard.widgetConfig.clock.showSeconds, true),
            showTimeOfDayIcon: dashboard.helpers.config.setValue(dashboard.widgetConfig.clock.showTimeOfDayIcon, true),
            TwelvehourClock: dashboard.helpers.config.setValue(dashboard.widgetConfig.clock.TwelvehourClock, false),
            hexColour: dashboard.helpers.config.setValue(dashboard.widgetConfig.clock.hexColour, false)
        },
        date : {
            showDate: dashboard.helpers.config.setValue(dashboard.widgetConfig.date.showDate, true),
            showYear: dashboard.helpers.config.setValue(dashboard.widgetConfig.date.showYear, true),
            shortDay: dashboard.helpers.config.setValue(dashboard.widgetConfig.date.shortDay, false),
            shortMonth: dashboard.helpers.config.setValue(dashboard.widgetConfig.date.shortMonth, false)
        }
    };

    var _dom = {
        container: dashboard.container,
        clock: document.querySelector('#' + dashboard.container.id + ' [data-widget-clock]'),
        date: document.querySelector('#' + dashboard.container.id + ' [data-widget-date]'),
    };

    var exports = {};

    function _render_date(){
        var html = [],
            date = new Date();

        html.push('<span class="date-section date-day">' + dashboard.helpers.date.getDayString(date.getDay()) + '</span>');
        html.push('<span class="date-section date-date">' + date.getDate() + '</span>');
        html.push('<span class="date-section date-month">' + dashboard.helpers.date.getMonthString(date.getMonth()) + '</span>');

        if(_config.date.showYear){
            html.push('<span class="date-section date-year">' + date.getFullYear() + '</span>');
        }

        _dom.date.innerHTML = html.join('');

        setTimeout(_render_date, 100000);
    }

    function _render_time(){
        var html = [],
            date = new Date(),
            hour = (date.getHours() <= 9) ? '0' + date.getHours() : date.getHours(),
            mins = (date.getMinutes() <= 9) ? '0' + date.getMinutes() : date.getMinutes(),
            seconds = (date.getSeconds() <= 9) ? '0' + date.getSeconds() : date.getSeconds(),
            hex = '#' + hour + mins + seconds,
            pmAm = (hour > 12) ? 'pm' : 'am';

        if(_config.clock.hexColour){
            _dom.container.style.backgroundColor = hex;
        }

        if(_config.clock.showTimeOfDayIcon){
            html.push('<div class="clock-section clock-icon"><i class="icon '  + getTimeOfDayIcon(hour) + '"></i></div>');
        }

        if(_config.clock.TwelvehourClock && hour > 12){
            hour = (hour - 12);
        }

        html.push('<div class="clock-section clock-time">');
        html.push('<span class="clock-hours">' + hour + ':</span>');
        html.push('<span class="clock-mins">' + mins + '</span>');

        if(_config.clock.showSeconds){
            html.push('<span class="clock-seconds">:' + seconds + '</span>');
        }

        if(_config.TwelvehourClock){
            html.push('<span class="clock-pm-am">' + pmAm + '</div>');
        }

        html.push('</div>');

        _dom.clock.innerHTML = html.join('');

        setTimeout(_render_time, 1000);

        function getTimeOfDayIcon(hour) {
            if(hour > 0 && hour < 8){
                return 'icon-morning';
            } else if(hour > 07 && hour < 13) {
                return 'icon-sunny';
            } else if (hour > 12 && hour < 19){
                return 'icon-afternoon';
            } else if (hour > 18 && hour <= 23) {
                return 'icon-evening';
            }
        }
    }

    exports.init = function() {
        _render_time();

        if(_config.date.showDate){
            _render_date();
        }
    };

    return exports;
}
