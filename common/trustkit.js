// trustkit
try {
    var Activity = Java.use("com.datatheorem.android.trustkit.pinning.OkHostnameVerifier");
    Activity.verify.overload('java.lang.String', 'javax.net.ssl.SSLSession').implementation = function (str) {
        console.log('[!] Intercepted trustkit{1}: ' + str);
        return true;
    };

    Activity.verify.overload('java.lang.String', 'java.security.cert.X509Certificate').implementation = function (str) {
        console.log('[!] Intercepted trustkit{2}: ' + str);
        return true;
    };
} catch (err) {
}