function WidgetHelpers(){
    var exports = {};

    exports.config = {
        setValue: function(value, default_value){
            return ((value !== undefined) ? value : default_value);
        },
        isUndefined: function(value){
            return (value === undefined);
        },
    };

    exports.date = {
        getDayString: function(day_number, short_day){
            var days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
            var shortDays = ['Sun', 'Mon', 'Tues', 'Wed', 'Thurs', 'Fri', 'Sat'];

            if(short_day){
                return shortDays[day_number];
            }

            return days[day_number];
        },
        getMonthString: function(month_number, short_month){
            var months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
            var shortMonths = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'June', 'July', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'];

            if(short_month){
                return shortMonths[month_number];
            }

            return months[month_number];
        }
    };

    exports.isEmptyObject = function(object){
        return Object.keys(object).length === 0;
    };

    exports.asyncRequest = function(data){
        return new Promise(function(resolve, reject) {
            var request = new XMLHttpRequest();
            request.open(data.method, data.uri);
            request.onload = function() {
                if (request.status === 200) {
                    resolve((data.type === 'json') ? JSON.parse(request.response) : request.response);
                } else {
                    reject(Error(request.statusText));
                }
            };
            request.onerror = function() {
                reject(Error('Error fetching data.'));
            };
            request.send(); //send the request
        });
    };

    exports.getLocation = function(data) {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(function(position){
                data.completeCallback(position);
            }, function(error){

                var message;

                switch(error.code)
                {
                    case error.PERMISSION_DENIED:
                        console.warn('Geolocation Error - User denied the request for Geolocation.');
                        message = 'User Permission was not given';
                        break;
                    case error.POSITION_UNAVAILABLE:
                        console.warn('Geolocation Error - Location information is unavailable.');
                        message = 'Your device was unable to get your location';
                        break;
                    case error.TIMEOUT:
                        console.warn('Geolocation Error - The request to get user location timed out.');
                        message = 'Location request timed out';
                        break;
                    case error.UNKNOWN_ERROR:
                        console.warn('Geolocation Error - An unknown error occurred.');
                        message = 'An unknown error occured';
                        break;
                }

                console.log(error);

                if(typeof data.errorCallback === 'function'){
                    data.errorCallback(message, error);
                }

            }, data.options);
        } else {
            console.warn('You browser does not support geolocation');
        }
    };

    return exports;
}

