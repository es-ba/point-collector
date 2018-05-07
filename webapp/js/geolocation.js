var Geolocator = {};
Geolocator.getAccessToLocation=function(geoOptions, callbackFunctionErr) {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position) {}, function(){callbackFunctionErr(1)}, geoOptions);
    } else {
       alert("Geolocation is not supported by this browser.");
    }
}
Geolocator.getCurrentLocation=function(callbackFunction, callbackFunctionErr, secuencia, numeroPunto, geoOptions) {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position) {
                                                    callbackFunction(position, secuencia, numeroPunto);
                                                }, 
                                                function(){
                                                    callbackFunctionErr(2, secuencia, numeroPunto);
                                                }, geoOptions);
    } else {
       alert("Geolocation is not supported by this browser.");
    }
}
Geolocator.watchLocation=function(callbackFunction, callbackFunctionErr, geoOptions) {
    if (navigator.geolocation) {
        navigator.geolocation.watchPosition(function(position) {
            if(callbackFunction){
                callbackFunction(position);
            }
        }, callbackFunctionErr(3), geoOptions);
    } else {
       alert("Geolocation is not supported by this browser.");
    }
}