enyo.kind({
    name: "SpringpadApi",
    kind: enyo.Component,
    events: {
    	onFetchSuccess: "",
    	onFetchFailure: "",
    	onPostSuccess: "",
    	onPostFailure: ""
    },
    components: [
        { name: "fetchDataService", kind: "WebService",
            onSuccess: "fetchDataSuccess",
            onFailure: "fetchDataFailure",
            components: [
                {
                    handleAs: "json",
                    contentType: "application/x-www-form-urlencoded"
                }
            ]
        },
    ],

    fetchData: function( path, method, post, password, filename ) {
        var host = "http://springpad.com/api/";
        if (post !== undefined && post != null && post != "") {
            host = "https://springpad.com/api/";
        }
        var url = host + path + (filename !== undefined && filename != null ? "?filename=" + encodeURI(filename) : "");

        // add required headers
        var pwd = Settings.getSettings().password;
        if (password !== undefined && password != null && password != "") {
            pwd = password;
        }
        
        var headers;
        if (Platform.isWebOS()) {
            headers = {
                "X-Spring-Username": Settings.getSettings().username, 
                "X-Spring-Password" : pwd,
                "X-Spring-Api-Token" : Settings.getSettings().apiKey, 
                "X-Spring-Client-Version": "1.0.0", 
                "X-Spring-Client": "SpingOnTouch", 
                "Content-Type": "application/json; charset=UTF-8",
                "Referer": "http://sven-ziegler.com", 
                "X-Spring-Api-Version" : "7"
            };
        } else {
            headers = {
                "X-Spring-Username": Settings.getSettings().username, 
                "X-Spring-Password" : pwd,
                "X-Spring-Api-Token" : Settings.getSettings().apiKey, 
                "X-Spring-Client-Version": "1.0.0", 
                "X-Spring-Client": "SpingOnTouch", 
                "Content-Type": "application/json; charset=UTF-8",
                "X-Spring-Api-Version" : "7"
            };
        }
    
        if (Util.isDebug()) {
            this.log("url: " + url);
            this.log("method: " + method);
            this.log("onFetchSuccess: " + this.onFetchSuccess);
            this.log("onFetchFailure: " + this.onFetchFailure);
        }

        this.$.fetchDataService.setUrl( url );
        this.$.fetchDataService.setMethod( method );
        this.$.fetchDataService.setHeaders( headers );
        if (post !== undefined && post != null && post != "") {
            this.$.fetchDataService.call( post );
        } else {
            this.$.fetchDataService.call( );
        }
    },
    
    fetchDataSuccess: function(inSender, inResponse, inRequest)  {
        this.doFetchSuccess( inResponse, inRequest );
    },
    
    fetchDataFailure: function(inSender, inResponse, inRequest)  {
        this.doFetchFailure( inResponse, inRequest );
    },
   
    postData: function( path, callbackOnSuccess, callbackOnFailure, data, mimeType, filename, filePath ) {
        var method = "POST";
        host = "http://springpad.com/api/";
        var url = host + path;
        if (filename !== undefined && filename != null) {
            url += "?filename=" + encodeURIComponent(filename) + (Platform.isWebOS() ? "&encoding=base64" : "");
            // url += "?filename=" + encodeURIComponent(filename) + "&encoding=base64";
        } else {
            url += (Platform.isWebOS() ? "?encoding=base64" : "");
            // url += "?encoding=base64";
        }
        if (Util.isDebug()) {
            this.log("url: " + url);

            this.log("data.length: " + data.length);
        }

        // add required headers
        var headers;
        if (Platform.isWebOS()) {
            headers = {
                "X-Spring-Username": Settings.getSettings().username, 
                "X-Spring-Password" : Settings.getSettings().password,
                "X-Spring-Api-Token" : Settings.getSettings().apiKey, 
                "X-Spring-Client-Version": "1.0.0", 
                "X-Spring-Client": "SpingOnTouch", 
                "Content-Type": "text\/plain; charset=x-user-defined" /*mimeType*/,
                "Content-Length": data.length,
                "Referer": "http://sven-ziegler.com", 
                "X-Spring-Api-Version" : "7"
            };
        } else {
            headers = {
                "X-Spring-Username": Settings.getSettings().username, 
                "X-Spring-Password" : Settings.getSettings().password,
                "X-Spring-Api-Token" : Settings.getSettings().apiKey, 
                "X-Spring-Client-Version": "1.0.0", 
                "X-Spring-Client": "SpingOnTouch", 
                "Content-Type": mimeType,
                "X-Spring-Api-Version" : "7"
            };
        }
    
        if (Util.isDebug()) {
            this.log("headers: " + JSON.stringify(headers));
        }
    
        var myargs = {
            "url": url,
            "load": enyo.bind (this, this.postDataSuccess),
            "error": enyo.bind (this, this.postDataFailure),
            "body": data,
            "headers": headers
        };        

        enyo.xhrPost( myargs );    
    },
    
    postDataSuccess: function(inSender, inResponse, inRequest)  {
        this.doPostSuccess( inResponse, inRequest );
    },
    
    postDataFailure: function(inSender, inResponse, inRequest)  {
        this.doPostFailure( inResponse, inRequest );
    },
    
});