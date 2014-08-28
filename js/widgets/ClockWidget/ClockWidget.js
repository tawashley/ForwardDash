function ClockWidget() {

    var _config = {
        clock: document.getElementById('clock-widget-clock'),
        date: document.getElementById('clock-widget-date')
    }

    var exports = {};

    function _render_date(){
        var html = [],
            date = new Date();

        html.push('<span class="date-section date-day">' + getDayString(date.getDay()) + '</span>');
        html.push('<span class="date-section date-date">' + date.getDate() + '</span>');
        html.push('<span class="date-section date-month">' + getMonthString(date.getMonth()) + '</span>');
        html.push('<span class="date-section date-year">' + date.getFullYear() + '</span>');

        _config.date.innerHTML = html.join('');

        function getDayString(day_number){
            var days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
            return days[day_number];
        }

        function getMonthString(month_number){
            var months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
            return months[month_number];
        }

    }

    function _render_time(){
        var html = [],
            date = new Date(),
            hour = (date.getHours() <= 9) ? '0' + date.getHours() : date.getHours(),
            mins = (date.getMinutes() <= 9) ? '0' + date.getMinutes() : date.getMinutes(),
            seconds = (date.getSeconds() <= 9) ? '0' + date.getSeconds() : date.getSeconds();

        html.push('<div class="clock-section clock-icon"><i class="icon '  + getTimeOfDayIcon(hour) + '"></i></div>')

        html.push('<div class="clock-section clock-time">');
        html.push('<span class="clock-hours">' + hour + ':</span>');
        html.push('<span class="clock-mins">' + mins + ':</span>');
        html.push('<span class="clock-seconds">' + seconds + '</span>');
        html.push('</div>');

        _config.clock.innerHTML = html.join('');

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
        _render_date();
    };

    return exports;
};