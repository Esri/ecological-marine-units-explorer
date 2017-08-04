/*
 Copyright 2017 Esri

 Licensed under the Apache License, Version 2.0 (the "License");

 you may not use this file except in compliance with the License.

 You may obtain a copy of the License at

 http://www.apache.org/licenses/LICENSE-2.0

 Unless required by applicable law or agreed to in writing, software

 distributed under the License is distributed on an "AS IS" BASIS,

 WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.

 See the License for the specific language governing permissions and

 limitations under the License.​
 */
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