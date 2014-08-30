function ClockWidget(config, helpers) {

    var _config = {
        clock: {
            showSeconds: helpers.config.setValue(config.clock.showSeconds, true),
            showTimeOfDayIcon: helpers.config.setValue(config.clock.showTimeOfDayIcon, true),
            TwelvehourClock: helpers.config.setValue(config.clock.TwelvehourClock, false),
        },
        date : {
            showDate: helpers.config.setValue(config.date.showDate, true),
            showYear: helpers.config.setValue(config.date.showYear, true),
            shortDay: helpers.config.setValue(config.date.shortDay, false),
            shortMonth: helpers.config.setValue(config.date.shortMonth, false)
        }
    };

    var _dom = {
        clock: document.getElementById('clock-widget-clock'),
        date: document.getElementById('clock-widget-date')
    };

    var exports = {};

    function _render_date(){
        var html = [],
            date = new Date();

        html.push('<span class="date-section date-day">' + getDayString(date.getDay()) + '</span>');
        html.push('<span class="date-section date-date">' + date.getDate() + '</span>');
        html.push('<span class="date-section date-month">' + getMonthString(date.getMonth()) + '</span>');

        if(_config.date.showYear){
            html.push('<span class="date-section date-year">' + date.getFullYear() + '</span>');
        }

        _dom.date.innerHTML = html.join('');

        function getDayString(day_number){
            var days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
            var shortDays = ['Sun', 'Mon', 'Tues', 'Wed', 'Thurs', 'Fri', 'Sat']

            if(_config.date.shortDay){
                return shortDays[day_number];
            }

            return days[day_number];
        }

        function getMonthString(month_number){
            var months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
            var shortMonths = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'June', 'July', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'];

            if(_config.date.shortMonth){
                return shortMonths[month_number];
            }

            return months[month_number];
        }

        setTimeout(_render_date, 100000);
    }

    function _render_time(){
        var html = [],
            date = new Date(),
            hour = (date.getHours() <= 9) ? '0' + date.getHours() : date.getHours(),
            mins = (date.getMinutes() <= 9) ? '0' + date.getMinutes() : date.getMinutes(),
            seconds = (date.getSeconds() <= 9) ? '0' + date.getSeconds() : date.getSeconds(),
            pmAm = (hour > 12) ? 'pm' : 'am';

        if(_config.clock.showTimeOfDayIcon){
            html.push('<div class="clock-section clock-icon"><i class="icon '  + getTimeOfDayIcon(hour) + '"></i></div>')
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
            if(hour > 00 && hour < 08){
                return 'icon-early-morning';
            } else if(hour > 07 && hour < 13) {
                return 'icon-morning';
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
};