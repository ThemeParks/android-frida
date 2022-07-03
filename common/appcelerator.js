try {
    var PinningTrustManager = Java.use('appcelerator.https.PinningTrustManager');
    PinningTrustManager.checkServerTrusted.implementation = function () {
        console.log('[!] Intercepted Appcelerator');
    }
} catch (e) { }