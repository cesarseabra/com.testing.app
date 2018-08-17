/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
var app = {
    device: null,
    // Application Constructor
    initialize: function () {
        this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function () {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicitly call 'app.receivedEvent(...);'
    onDeviceReady: function () {
        app.receivedEvent('deviceready');
    },
    // Update DOM on a Received Event
    receivedEvent: function (id) {
        app.registerLocationChangeHandler();
        app.requestLocationAuth();
    },
    requestLocationAuth: function () {
        if (device.platform == 'Android') {
            cordova.plugins.diagnostic.requestLocationAuthorization(function (status) {
                switch (status) {
                    case cordova.plugins.diagnostic.permissionStatus.GRANTED:
                        cordova.plugins.diagnostic.isLocationEnabled(function (enabled) {
                            if (!enabled) {
                                app.requestLocationServicesActivation();
                            }
                        }, function (error) {
                            console.error("The following error occurred: " + error);
                        });
                        break;

                    case cordova.plugins.diagnostic.permissionStatus.NOT_REQUESTED:
                        Ctrl.location_use_location = Ctrl.LOCATION_NONE;
                        break;

                    case cordova.plugins.diagnostic.permissionStatus.DENIED:
                        Ctrl.location_use_location = Ctrl.LOCATION_REFUSED;
                        break;

                    case cordova.plugins.diagnostic.permissionStatus.DENIED_ALWAYS:
                        Ctrl.location_use_location = Ctrl.LOCATION_REFUSED;
                        break;

                }
            }, function (error) {
                Ctrl.location_use_location = Ctrl.LOCATION_NONE;
                console.log('Error request: ' + error);
            });
        } else if (device.platform == 'iOS') {
            show('request loc','requested');
            cordova.plugins.diagnostic.requestLocationAuthorization(function (status) {
                show('request loc stat',status);
                switch (status) {
                    case cordova.plugins.diagnostic.permissionStatus.NOT_REQUESTED:
                        Ctrl.location_use_location = Ctrl.LOCATION_NONE;
                        break;

                    case cordova.plugins.diagnostic.permissionStatus.DENIED:
                        Ctrl.location_use_location = Ctrl.LOCATION_REFUSED;
                        break;

                    case cordova.plugins.diagnostic.permissionStatus.GRANTED:
                        Ctrl.location_use_location = Ctrl.LOCATION_AGREE;
                        break;

                    case cordova.plugins.diagnostic.permissionStatus.GRANTED_WHEN_IN_USE:
                        Ctrl.location_use_location = Ctrl.LOCATION_AGREE;
                        break;

                }
            }, function (error) {
                Ctrl.location_use_location = Ctrl.LOCATION_NONE;
                console.log('Error request: ' + error);
            });
        }
    },
    registerLocationChangeHandler: function () {
        cordova.plugins.diagnostic.registerLocationStateChangeHandler(function (state) {
            if ((device.platform === "Android" && state !== cordova.plugins.diagnostic.locationMode.LOCATION_OFF) ||
                (device.platform === "iOS") && (state === cordova.plugins.diagnostic.permissionStatus.GRANTED ||
                    state === cordova.plugins.diagnostic.permissionStatus.GRANTED_WHEN_IN_USE
                )) {
                    swal({
                        title: 'Success',
                        text: 'Location services successfully activated',
                        showConfirmButton: false,
                        timer: 2000,
                        allowOutsideClick: false,
                        type: "success"
                    });
                Ctrl.location_use_location = Ctrl.LOCATION_AGREE;
            } else {
                app.requestLocationServicesActivation();
            }
        });
    },
    requestLocationServicesActivation: function () {
        if (device.platform == 'Android') {
            swal({
                    title: "Location Disabled",
                    text: "In order to a better sales managment please consider turning on the location services on yout device!",
                    type: "warning",
                    showCancelButton: true,
                    confirmButtonText: "Settings",
                    closeOnConfirm: false
                },
                function (confirmed) {
                    if (confirmed) {
                        cordova.plugins.diagnostic.switchToLocationSettings();
                    } else {
                        Ctrl.location_use_location = Ctrl.LOCATION_REFUSED;
                    }
                });
        } else {
            Ctrl.location_use_location = Ctrl.LOCATION_NONE;
        }
    }
};

var Ctrl = {
    currentLang: 'en',
    location_use_location: false,
    location_coords: {
        latitude: null,
        longitude: null
    },
    LOCATION_REFUSED: 'err_refused',
    LOCATION_NONE: 'err_none',
    LOCATION_AGREE: 'use',
};

//########################################################

var show = function (varName, vari) {
    $('.textBody').append(
        '<span class="variableName">' + varName + '</span>' +
        '<span class="variableName">:</span>' +
        '<span class="variable">' + vari + '</span>' +
        '<br>');
    $('.textBody').goTo();
};

//########################################################

$('.btnLimpar').on('click', function () {
    $('.textBody').empty();
});

//########################################################

$('.login').on('click', function () {
    SumUpApp.login(function (res) {
        console.log('Login { success: ' + res.success + ' | message: ' + res.message + ' }');
    });
});

//########################################################

$('.logout').on('click', function () {
    SumUpApp.logout(function (res) {
        console.log('Logout { success: ' + res.success + ' | message: ' + res.message + ' }');
    });
});

//########################################################

$('.closing').on('click', function () {
    sumUp.close(function (res) {
        console.log('Close { success: ' + res.success + ' | message: ' + res.message + ' }');
    });
});

//########################################################

$('.settings').on('click', function () {
    SumUpApp.configure(function (res) {
        console.log('Settings { success: ' + res.success + ' | message: ' + res.message + ' }');
    });
});

//########################################################

$('.pay').on('click', function () {
    var priceToPay = $('#texting').val();
    if (priceToPay == '') priceToPay = '1.00';
    SumUpApp.pay(priceToPay, 'EUR', 'Testing Payment SDK', function (res) {
        console.log('Payment { success: ' + res.success + ' | message: ' + res.message + ' }');
    });
});

//########################################################

$('.subscribe').on('click', function () {
    SumUpApp.prepare(function (res) {
        console.log('Prepare { success: ' + res.success + ' | message: ' + res.message + ' }');
    });

});

//########################################################
/* { maximumAge: 3000, timeout: 5000, enableHighAccuracy: true };
 */
$('.getLocation').on('click', function () {

    if (Ctrl.location_use_location != Ctrl.LOCATION_NONE && Ctrl.location_use_location != Ctrl.LOCATION_REFUSED) {
        navigator.geolocation.getCurrentPosition(function (position) {

            show('LAT', position.coords.latitude);
            console.log('LAT: ' + position.coords.latitude);

            show('LON', position.coords.longitude);
            console.log('LON: ' + position.coords.longitude);

            show('ACC', position.coords.accuracy);
            console.log('ACC: ' + position.coords.accuracy);

            show('ALT', position.coords.altitude);
            console.log('ALT: ' + position.coords.altitude);

            show('HEA', position.coords.heading);
            console.log('HEA: ' + position.coords.heading);

            show('SPE', position.coords.speed);
            console.log('SPE: ' + position.coords.speed);

            show('ALT ACC', position.coords.altitudeAccuracy);
            console.log('ALT ACC: ' + position.coords.altitudeAccuracy);

            Ctrl.location_coords.latitude = position.coords.latitude;
            Ctrl.location_coords.longitude = position.coords.longitude;

        }, function (error) {

            show('ERR code', error.code);
            console.log('ERR code: ' + error.code);

            show('ERR message', error.message);
            console.log('ERR message: ' + error.message);

        }, {
            maximumAge: 3000,
            timeout: 5000,
            enableHighAccuracy: false
        });
    }


});

//########################################################

$('.checkPerm').on('click', function () {

    if (device.platform == 'Android') {
        cordova.plugins.diagnostic.getLocationAuthorizationStatus(function (status) {
            switch (status) {
                case cordova.plugins.diagnostic.permissionStatus.NOT_REQUESTED:
                    console.log("Permission not requested");
                    show('status', 'Permission to use the location has not been requested yet');
                    break;
                case cordova.plugins.diagnostic.permissionStatus.GRANTED:
                    console.log("Permission granted");
                    show('status', 'Permission granted to use the location');
                    break;
                case cordova.plugins.diagnostic.permissionStatus.DENIED:
                    console.log("Permission denied");
                    show('status', 'Permission denied to use the location - ask again?');
                    break;
                case cordova.plugins.diagnostic.permissionStatus.DENIED_ALWAYS:
                    console.log("Permission permanently denied");
                    show('status', 'Permission permanently denied to use the location - guess we won\'t be using it then!');
                    break;
            }
        }, function (error) {
            console.error(error);
            show('log', 'Aconteceu este erro: ' + error);
        });
    } else if (device.platform == 'iOS') {
        cordova.plugins.diagnostic.getLocationAuthorizationStatus(function (status) {
            switch (status) {
                case cordova.plugins.diagnostic.permissionStatus.NOT_REQUESTED:
                    console.log("Permission not requested");
                    show('log', "Permission not requested");
                    break;
                case cordova.plugins.diagnostic.permissionStatus.DENIED:
                    console.log("Permission denied");
                    show('log', "Permission denied");
                    break;
                case cordova.plugins.diagnostic.permissionStatus.GRANTED:
                    console.log("Permission granted always");
                    show('log', "Permission granted always");
                    break;
                case cordova.plugins.diagnostic.permissionStatus.GRANTED_WHEN_IN_USE:
                    console.log("Permission granted only when in use");
                    show('log', "Permission granted only when in use");
                    break;
            }
        }, function (error) {
            console.error("The following error occurred: " + error);
            show('log', "The following error occurred: " + error);
        });
    }

});

//########################################################

$('.locAvailable').on('click', function () {
    cordova.plugins.diagnostic.isLocationAvailable(function (available) {
        console.log("Location is " + (available ? "available" : "not available"));
        show('log', "Location is " + (available ? "available" : "not available"));
    }, function (error) {
        console.error("The following error occurred: " + error);
        show('log', "The following error occurred: " + error);
    });
});

//########################################################

$('.locEnabled').on('click', function () {
    cordova.plugins.diagnostic.isLocationEnabled(function (enabled) {
        console.log("Location setting is " + (enabled ? "enabled" : "disabled"));
        show('log', "Location setting is " + (enabled ? "enabled" : "disabled"));
    }, function (error) {
        console.error("The following error occurred: " + error);
        show('log', "The following error occurred: " + error);
    });
});

//########################################################

$('.authorized').on('click', function () {
    cordova.plugins.diagnostic.isLocationAuthorized(function (authorized) {
            console.log("Location is " + (authorized ? "authorized" : "unauthorized"));
            show('log', "Location is " + (authorized ? "authorized" : "unauthorized"));
        },
        function (error) {
            console.error("The following error occurred: " + error);
            show('log', "The following error occurred: " + error);
        });
});

//########################################################

$('.request').on('click', function () {
    if (device.platform == 'Android') {
        cordova.plugins.diagnostic.requestLocationAuthorization(function (status) {
            switch (status) {
                case cordova.plugins.diagnostic.permissionStatus.NOT_REQUESTED:
                    console.log("Permission not requested");
                    show('log', "Permission not requested");
                    break;
                case cordova.plugins.diagnostic.permissionStatus.GRANTED:
                    console.log("Permission granted");
                    show('log', "Permission granted");
                    break;
                case cordova.plugins.diagnostic.permissionStatus.DENIED:
                    console.log("Permission denied");
                    show('log', "Permission denied");
                    break;
                case cordova.plugins.diagnostic.permissionStatus.DENIED_ALWAYS:
                    console.log("Permission permanently denied");
                    show('log', "Permission permanently denied");
                    break;
            }
        }, function (error) {
            console.error(error);
            show('log', 'Aconteceu este erro: ' + error);
        });
    } else if (device.platform == 'iOS') {
        cordova.plugins.diagnostic.requestLocationAuthorization(function (status) {
            switch (status) {
                case cordova.plugins.diagnostic.permissionStatus.NOT_REQUESTED:
                    console.log("Permission not requested");
                    show('log', "Permission not requested");
                    break;
                case cordova.plugins.diagnostic.permissionStatus.DENIED:
                    console.log("Permission denied");
                    show('log', "Permission denied");
                    break;
                case cordova.plugins.diagnostic.permissionStatus.GRANTED:
                    console.log("Permission granted always");
                    show('log', "Permission granted always");
                    break;
                case cordova.plugins.diagnostic.permissionStatus.GRANTED_WHEN_IN_USE:
                    console.log("Permission granted only when in use");
                    show('log', "Permission granted only when in use");
                    break;
            }
        }, function (error) {
            console.error(error);
            show('log', 'Aconteceu este erro: ' + error);
        }, cordova.plugins.diagnostic.locationAuthorizationMode.ALWAYS);
    }
});

//########################################################

$('.testSend').on('click', function () {
    if (Ctrl.location_use_location == Ctrl.LOCATION_NONE) {
        show('Send', Ctrl.LOCATION_NONE);
    } else if (Ctrl.location_use_location == Ctrl.LOCATION_REFUSED) {
        show('Send', Ctrl.LOCATION_REFUSED);
    } else {
        show('Send', JSON.stringify(Ctrl.location_coords));
    }
});


//########################################################
//########################################################
//########################################################

(function ($) {
    $.fn.goTo = function () {
        $('html, body').animate({
            scrollTop: $(this).offset().top + 'px'
        }, 'fast');
        return this; // for chaining...
    }
})(jQuery);