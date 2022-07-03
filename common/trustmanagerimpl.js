var array_list = Java.use("java.util.ArrayList");
var TrustManagerImpl = Java.use('com.android.org.conscrypt.TrustManagerImpl');

TrustManagerImpl.checkTrustedRecursive.implementation = function (a1, a2, a3, a4, a5, a6) {
    console.log('[!] Intercepted TrustManagerImpl.checkTrustedRecursive');
    var k = array_list.$new();
    return k;
}

TrustManagerImpl.verifyChain.implementation = function (untrustedChain, trustAnchorChain, host, clientAuth, ocspData, tlsSctData) {
    console.log('[!] Intercepted TrustManagerImp: ' + host);
    for (var i = 0; i < trustAnchorChain.length; i++) {
        console.log(trustAnchorChain[i]);
    }
    return untrustedChain;
}

try {
    TrustManagerImpl.check.implementation = function (certificate, collection) {
        console.log('[!] Intercepted TrustManagerImp.check()');
        return;
    }
} catch (e) {}
