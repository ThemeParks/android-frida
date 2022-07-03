try {
    var rootCheck = Java.use('io.fabric.sdk.android.services.common.CommonUtils');
    rootCheck.isRooted.implementation = function () {
        console.log('[!] Skipping fabric SDK root check');
        return false;
    }
} catch (err) {}