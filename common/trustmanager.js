var X509TrustManager = Java.use('javax.net.ssl.X509TrustManager');
var SSLContext = Java.use('javax.net.ssl.SSLContext');

// build fake trust manager
var TrustManager = Java.registerClass({
    name: 'com.sensepost.test.TrustManager',
    implements: [X509TrustManager],
    methods: {
        checkClientTrusted: function (chain, authType) {
        },
        checkServerTrusted: function (chain, authType) {
        },
        getAcceptedIssuers: function () {
            return [];
        }
    }
});

// pass our own custom trust manager through when requested
var TrustManagers = [TrustManager.$new()];
var SSLContext_init = SSLContext.init.overload(
    '[Ljavax.net.ssl.KeyManager;', '[Ljavax.net.ssl.TrustManager;', 'java.security.SecureRandom'
);
SSLContext_init.implementation = function (keyManager, trustManager, secureRandom) {
    console.log('[!] Successfully intercepted trustmanager request');
    SSLContext_init.call(this, keyManager, TrustManagers, secureRandom);
};