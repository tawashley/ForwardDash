function WidgetHelpers(){
    var exports = {};

    exports.config = {
        setValue: function(value, default_value){
            return ((value !== undefined) ? value : default_value);
        },
        isUndefined: function(value){
            return (value === undefined);
        }
    }

    exports.asyncRequest = function(data, callback) {
        var xhr = new XMLHttpRequest();

        xhr.open(data.method, data.uri, true);

        xhr.onreadystatechange = function() {
            if (this.readyState !== 4 || this.status !== 200){
                return;
            }

            if(typeof callback == 'function'){
                callback((data.type === 'json') ? JSON.parse(this.responseText) : this.responseText);
            }
        };

        xhr.send();
    }

    exports.getLocation = function(data) {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(function(position){
                data.completeCallback(position);
            }, function(error){

                var message;

                switch(error.code)
                {
                    case error.PERMISSION_DENIED:
                        console.warn("Geolocation Error - User denied the request for Geolocation.");
                        message = 'User Permission was not given';
                        break;
                    case error.POSITION_UNAVAILABLE:
                        console.warn("Geolocation Error - Location information is unavailable.");
                        message = 'Your device was unable to get your location';
                        break;
                    case error.TIMEOUT:
                        console.warn("Geolocation Error - The request to get user location timed out.");
                        message = 'Location request timed out';
                        break;
                    case error.UNKNOWN_ERROR:
                        console.warn("Geolocation Error - An unknown error occurred.");
                        message = 'An unknown error occured';
                        break;
                }

                console.log(error);

                if(typeof data.errorCallback == 'function'){
                    data.errorCallback(message, error);
                }

            }, data.options);
        } else {
            console.warn('You browser does not support geolocation');
        }
    }

    return exports;
}

