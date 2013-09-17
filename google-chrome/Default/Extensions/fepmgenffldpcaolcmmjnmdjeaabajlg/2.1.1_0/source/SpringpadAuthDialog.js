enyo.kind({
    name: "SpringpadAuthDialog",
    kind: enyo.ModalDialog,
    height: "600px",
    width: "500px",
    components: [
        /*{ name: "OAuth1", kind: "OAuth" },*/
        { name: "webService1", kind: "WebService",
            onSuccess: "webService1AccessSuccess",
            onFailure: "webService1Failure",
            components: [
                {
                    method: "GET",
                    handleAs: "json",
                    contentType: "application/x-www-form-urlencoded"
                }
            ]
        },
        {kind: enyo.Scroller, flex: 1, height: "520px", autoVertical: false, horizontal: false, components: [
            {kind: "WebView", name: "webView", flex: 1, onPageTitleChanged: "pageTitleChanged"}
        ]}
    ],
    
    rendered : function () {
        this.inherited(arguments);
        this.setCaption("Springpad Authentification");
    },
    
    pageTitleChanged: function( inSender, inTitle, inUrl ) {
        var searchString = "springontouch/?oauth_token=";
        var pos = inUrl.indexOf( searchString );
        if (pos != -1) {
            // only send request once
            if (this.testvar == undefined || this.testvar == null) {
                this.testvar = "testvar";

                this.log("inTitle: " + inTitle);
                this.log("inUrl: " + inUrl);
                var requestToken = inUrl.substr(pos + searchString.length, inUrl.length);
                this.log("requestToken: " + requestToken);
                localStorage.setItem( "requestToken", requestToken );

                this.requestAccessToken( requestToken );
            }
        }
    },

    webService1AccessSuccess: function(inSender, inResponse, inRequest)
    {
      // this.log(inResponse);
        
      var token = OAuth.decodeForm(inResponse);
      var oauth_token = token[0][1];
      var oauth_token_secret = token[1][1];
      // this.accessor = { oauthToken: oauth_token, oauth_token_secret: oauth_token_secret};
// 
      // this.log(this.accessor);
      // enyo.setCookie("AuthTokens", enyo.json.stringify(this.accessor));
      
      this.log("oauth_token: " + oauth_token);
      this.log("oauth_token_secret: " + oauth_token_secret);
      
      this.$.webView.setUrl("http://springpad.com/api/oauth-authorize?oauth_token_secret=" + oauth_token_secret + "&oauth_token=" + oauth_token);
    },

    webService1PostSuccess: function(inSender, inResponse, inRequest)
    {
        this.log(inResponse);
    },

    webService1Failure: function(inSender, inResponse, inRequest)
    {
        this.error("inResponse: " + inResponse);
        this.error(JSON.stringify(inRequest.xhr));
        this.error("Status: " + inRequest.xhr.status);
    },

    fetch: function( path, method, parameters, post_data, headers, token, callback ) {
        //def _fetch(self, method='GET', parameters=None, post_data=None, headers=None, token=None, as_json=True):
        var host = "http://springpad.com/api/";
        var url = host + path;

        var accessor = { 
            consumerKey: "08abfc557f854d60aecbb550b83a1ec6",
            consumerSecret: "396b5b7ec90d48f994b33a79feb29b1b",
            token: token
        };
        
        var par = {
            oauth_signature: "",
            oauth_nonce: "",
            oauth_signature_method: "HMAC-SHA1",
            oauth_consumer_key: accessor.consumerKey,
            oauth_timestamp: "",
            oauth_version: "1.0"
        };

        var message  = { action: url, method: method, parameters: par };

        message = OAuth.setTimestampAndNonce( message );
        message = OAuth.completeRequest(message, accessor);
        // OAuth.SignatureMethod.sign( message, accessor );
        message.action = OAuth.addToURL( message.action, message.parameters );

        // add required headers
        headers = {"Authorization": "OAuth", 'X-Spring-Client': "SpingOnTouch", 'Content-Type': 'application/json; charset=UTF-8'};
        // if (token == "" || token == null) {
            // headers = {"Authorization": "OAuth" /*OAuth.getAuthorizationHeader(host, message.parameters)*/, 'X-Spring-Client': "SpingOnTouch", 'Content-Type': 'application/json; charset=UTF-8'};
        // } else {
            // headers = {"Authorization": OAuth.getAuthorizationHeader(host, message.parameters), 'X-Spring-Client': "SpingOnTouch", 'Content-Type': 'application/json; charset=UTF-8'};
        // }
    
        this.log("path: " + path);
        this.log("method: " + method);
        this.log("message.parameters: " + JSON.stringify(message.parameters));
        this.log("post_data: " + post_data);
        this.log("headers: " + JSON.stringify(headers));
        this.log("token: " + token);
        this.log("callback: " + callback);
        this.log("url: " + url);
        this.log("message: " + JSON.stringify(message));


        this.$.webService1.setUrl( message.action );
        this.$.webService1.setMethod( message.method );
        this.$.webService1.setHeaders( headers );
        if (callback != null) {
            // this.$.webService1.call( {onSuccess: callback} );
            this.$.webService1.call( );
        } else {
            this.$.webService1.call( );
        }
    },

    loginToSpringpad: function() {
        this.log();
        this.fetch( "oauth-request-token", "GET", null, null, null, null, null); 
    },

    requestAccessToken: function( requestToken ) {
        this.log();
        this.fetch( "oauth-access-token", "GET", null, null, null, requestToken, "webService1PostSuccess"); 
    },

    fetchSimple: function( path, method ) {
        //def _fetch(self, method='GET', parameters=None, post_data=None, headers=None, token=None, as_json=True):
        var host = "http://springpad.com/api/";
        var url = host + path;

        // add required headers
        headers = {"X-Spring-Username": Settings.getSettings().username, "X-Spring-Password" : Settings.getSettings().password, 'X-Spring-Client': "SpingOnTouch", 'Content-Type': 'application/json; charset=UTF-8'};
    
        this.log("path: " + path);
        this.log("method: " + method);
        this.log("url: " + url);


        this.$.webService1.setUrl( url );
        this.$.webService1.setMethod( method );
        this.$.webService1.setHeaders( headers );
        this.$.webService1.call( {onSuccess: "webService1PostSuccess"} );
    },

/*    requestAccessToken: function( requestToken ){
        // this.log("requestToken: " + requestToken);
        
        var url = "http://springpad.com/api/oauth-access-token";
        var accessor = {
          token: requestToken,
          consumerKey : "08abfc557f854d60aecbb550b83a1ec6",
          consumerSecret: "396b5b7ec90d48f994b33a79feb29b1b"
        };
        
        var par = {

            oauth_signature: "",
            oauth_nonce: "",
            oauth_signature_method: "HMAC-SHA1",
            oauth_consumer_key: this.access.consumerKey,
            oauth_token: requestToken,
            oauth_timestamp: "",
            oauth_version: "1.0",
            x_auth_mode: "client_auth"
        };

        this.message = {action: this.access.requestTokenURL, method: "GET", parameters: [] };
        this.message.parameters = par;


        this.message = this.$.OAuth1.setTimestampAndNonce(this.message);
        this.message = this.$.OAuth1.completeRequest(this.message, accessor);
        this.message.action = this.$.OAuth1.addToURL(this.message.action, this.message.parameters);


        url = url + '?' + this.$.OAuth1.formEncode(this.message.parameters);  
        
        this.log("url: " + url);
        /*      
        this.access = {};
        this.access = {
            consumerKey: "08abfc557f854d60aecbb550b83a1ec6",
            consumerSecret: "396b5b7ec90d48f994b33a79feb29b1b",
            requestTokenURL: "http://springpad.com/api/oauth-access-token"
        };

        this.accessor = {consumerSecret: this.access.consumerSecret, tokenSecret: ""};

        this.par = {};
        this.par = {

            oauth_signature: "",
            oauth_nonce: "",
            oauth_signature_method: "HMAC-SHA1",
            oauth_consumer_key: this.access.consumerKey,
            oauth_token: requestToken,
            oauth_timestamp: "",
            oauth_version: "1.0",
            x_auth_mode: "client_auth"
        };
        this.message = {action: this.access.requestTokenURL, method: "GET", parameters: [] };
        this.message.parameters = this.par;

        this.message = this.$.OAuth1.setTimestampAndNonce(this.message);
        this.message = this.$.OAuth1.sign(this.message, this.accessor);
        // this.message = this.$.OAuth1.completeRequest(this.message, this.accessor);
        this.message.action = this.$.OAuth1.addToURL(this.message.action, this.message.parameters);
        
        this.$.webService1.setUrl(this.message.action);
        this.$.webService1.setMethod(this.message.method);
        this.$.webService1.setHeaders({Authorization: "OAuth"});
        this.$.webService1.call({},{onSuccess: "webService1PostSuccess"});
    }*/
    
   
});