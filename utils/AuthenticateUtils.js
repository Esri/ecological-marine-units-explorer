define([
    "dojo/_base/declare",
    "dojo/_base/lang",
    "dojo/Deferred",
    "dojo/dom",
    "dojo/dom-style",
    "dojo/on",
    "dojo/query",
    "esri/lang",
    "esri/request",
    "esri/IdentityManager",
    "esri/arcgis/OAuthInfo",
    "config/config"
], function (declare, lang, Deferred, dom, domStyle, on, query, esriLang, esriRequest, esriId, OAuthInfo, Config) {

    return declare(null, {

        oauthConfig: null,
        credentials: null,

        constructor: function () {

            esriId.useSignInPage = false;

            this.oauthConfig = new OAuthInfo({
                appId: Config.APP_ID,
                // Uncomment this line to prevent the user's signed in state from being shared
                // with other apps on the same domain with the same authNamespace value.
                //authNamespace: "portal_oauth_inline",
                portalUrl: Config.SHARING_HOST,
                popup: false
            });

            on(query(".user-sign-in-btn")[0], "click", lang.hitch(this, this.portalSignInHandler));
            on(query(".sign-out-btn")[0], "click", lang.hitch(this, this.portalSignOutHandler));
        },

        authenticate: function () {
            var deferred = new Deferred();
            // Registers OAuth configurations
            esriId.registerOAuthInfos([this.oauthConfig]);

            // Returns the credential (via Deferred) if the user has already signed in to access the given resource.
            esriId.checkSignInStatus(this.oauthConfig.portalUrl).then(
                function (credentials) {
                    domStyle.set(query(".user-sign-in-btn")[0], "display", "none");
                    domStyle.set(query(".user-drop-down-navigation")[0], "display", "block");
                    deferred.resolve(credentials);
                }
            ).otherwise(
                function () {
                    domStyle.set(query(".user-sign-in-btn")[0], "display", "block");
                    domStyle.set(query(".user-drop-down-navigation")[0], "display", "none");
                }
            );
            return deferred.promise;
        },

        portalSignInHandler: function () {
            // Returns a Credential object that can be used to access the secured resource identified by the input url.
            esriId.getCredential(this.oauthConfig.portalUrl);
        },

        portalSignOutHandler: function () {
            // Destroys all credentials.
            esriId.destroyCredentials();
        }
    });
});