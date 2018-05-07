var AppCache = {};
AppCache.habilitar=function(){
    var appCache = window.applicationCache;
    //downloading manifest
    appCache.addEventListener('downloading', function (e) {
        var customElement = $("<div class='col-md-6 col-md-offset-3 wait-message'>");
        $.LoadingOverlay("show", {
            custom: customElement
        });
        customElement.text("Actualizando aplicación, por favor espere...");
    }, false);
    //first time cache
    appCache.addEventListener('cached', function (e) {
        $.LoadingOverlay("hide", true);
    }, false);
    //update cache
    appCache.addEventListener('updateready', function (e) {
        if (appCache.status === appCache.UPDATEREADY) {
            // Browser downloaded a new app cache.
            // Swap it in and reload the page to get the new hotness.
            appCache.swapCache();
            window.location.reload();
        } else {
            $.LoadingOverlay("hide", true);
        }
    }, false);
    //appCache.update();
}