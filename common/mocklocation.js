// disable Android mock location state getter
var loc = Java.use("android.location.Location");
loc.isFromMockProvider.implementation = function () {
    console.log('Intercepting Android isFromMockProvider()...');
    return false;
}