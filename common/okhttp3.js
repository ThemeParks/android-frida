// okhttp3
try {
    var CertificatePinner = Java.use('okhttp3.CertificatePinner');
    CertificatePinner.check.overload('java.lang.String', 'java.util.List').implementation = function (str) {
        console.log('[!] Intercepted okhttp3 for domain: ' + str);
        return;
    };
} catch (err) {
    // ignore failures, not using http3
}