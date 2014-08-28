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
            var months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August'];

            return months[month_number];
        }

    }

    function _render_time(){
        var html = [],
            date = new Date(),
            hour = (date.getHours() <= 9) ? '0' + date.getHours() : date.getHours(),
            mins = (date.getMinutes() <= 9) ? '0' + date.getMinutes() : date.getMinutes(),
            seconds = (date.getSeconds() <= 9) ? '0' + date.getSeconds() : date.getSeconds();

        html.push('<span class="clock-section clock-hours">' + hour + ':</span>');
        html.push('<span class="clock-section clock-mins">' + mins + ':</span>');
        html.push('<span class="clock-section clock-seconds">' + seconds + '</span>');

        _config.clock.innerHTML = html.join('');

        setTimeout(_render_time, 1000);
    }

    exports.init = function() {
        _render_time();
        _render_date();
    };

    return exports;
};