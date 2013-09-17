enyo.kind({
    name: "Share",
    kind: enyo.Control,
    events: {
        onAccept: ""
    },
    components: [
		{
			name: "openEmailCall",
			kind: "PalmService",
			service: "palm://com.palm.applicationManager/",
			method: "open",
			onSuccess: "openEmailSuccess",
			onFailure: "openEmailFailure",
			onResponse: "gotResponse",
	   },
       {name: "shareList", kind: "PopupSelect", onSelect: "popupShareItemSelect", items: [
            {caption: $L("Share by / via:"), disabled: true, value: "-1"}, 
            {name: "itemEMail", caption: $L("Mail"), value: "0", icon: "images/mail-32x32.png"}, 
            {name: "itemMessaging", caption: $L("Messaging"), value: "1", icon: "images/messaging-32x32.png"}, 
            {name: "itemPdf", caption: $L("Create PDF (via Mail)"), value: "8", icon: "images/pdf-32x32.png"},
            {name: "itemFacebook", caption: "Facebook", value: "2", icon: "images/facebook-32x32.png"},
            {name: "itemTwitter", caption: "Twitter", value: "3", icon: "images/twitter-32x32.png"},
            {name: "itemGoogle", caption: "Google+", value: "4", icon: "images/google-32x32.png"},
       ]},
       {name: "shareListOffline", kind: "PopupSelect", onSelect: "popupShareItemSelect", items: [
            {caption: $L("Share by / via:"), disabled: true, value: "-1"}, 
            {name: "itemEMail", caption: $L("Mail"), value: "0", icon: "images/mail-32x32.png"}, 
            {name: "itemMessaging", caption: $L("Messaging"), value: "1", icon: "images/messaging-32x32.png"}, 
       ]},
       {name: "shareListNonWebOS", kind: "PopupSelect", onSelect: "popupShareItemSelect", items: [
            {caption: "Share by / via:", disabled: true, value: "-1"}, 
            {name: "itemEMail", caption: $L("Mail"), value: "0", icon: "images/mail-32x32.png"}, 
            {name: "itemPdf", caption: $L("Create PDF (via Mail)"), value: "8", icon: "images/pdf-32x32.png"},
            {name: "itemFacebook", caption: "Facebook", value: "2", icon: "images/facebook-32x32.png"},
            {name: "itemTwitter", caption: "Twitter", value: "3", icon: "images/twitter-32x32.png"},
            {name: "itemGoogle", caption: "Google+", value: "4", icon: "images/google-32x32.png"},
       ]},
       {name: "shareListOfflineNonWebOS", kind: "PopupSelect", onSelect: "popupShareItemSelect", items: [
            {caption: "Share by / via:", disabled: true, value: "-1"}, 
            {name: "itemEMail", caption: $L("Mail"), value: "0", icon: "images/mail-32x32.png"}, 
       ]},
       {kind: "ModalDialog", name: "noUrlDialog", caption: $L("No URL available"), components:[
             {content: $L("This object does not contain a url to share."), className: "enyo-paragraph"},
             {layoutKind: "HFlexLayout", components: [
                 {kind: "Button", caption: $L("Ok"), flex: 1, onclick: "closeNoUrlDialog"},
             ]}
       ]},
    ],
    
    published: {
        item: null,
        link: '',
        isNotebook: false,
        hasSource: false,
        hasPublicNotebook: false,
        isPublicNotebook: false
    },
   
    shareItem : function( ) {
        if (Util.isDebug()) {
            this.log("START");
        }
        // this.log("Settings.getSettings().online: " + Settings.getSettings().online);
        var item = this.item;
        
        var hasSource = (enyo.isArray(item.properties.sources) && item.properties.sources.length > 0 ? true : false);
        if (hasSource == false) {
        	if (item.type == "/Type(Recipe)/") {
            	this.link = (item.properties.source_url !== undefined ? item.properties.source_url : item.properties["/meta/sourceUrl"])
            } else {
            	this.link = (item.properties.url !== undefined ? item.properties.url : item.properties["/meta/sourceUrl"]);
            }
        	if (this.link !== undefined) {
        		hasSource = true;
        	}
        } else {
            this.link = item.properties.sources[ item.properties.sources.length -1 ].value;
        }
        if (Util.isDebug()) {
            this.log("hasSource: " + hasSource);
        }
        var isPublicNotebook = (item.properties["/meta/published"] == true && this.isNotebook == true ? true : false);
        if (Util.isDebug()) {
            this.log("isPublicNotebook: " + isPublicNotebook);
        }
        
        var tmp = false;
        var notebook = null;
        if (isPublicNotebook == false) {
            // this.log("item.properties.workbooks: " + item.properties.workbooks );
            notebook = this.owner.getDataManager().getWorkbooks( item.properties.workbooks );
            // this.log("notebook: " + JSON.stringify(notebook) );
            if (Util.isDebug()) {
                this.log("notebook.properties[/meta/url]: " + notebook.properties["/meta/url"] );
            }
            if (notebook.properties["/meta/published"] !== undefined) {
                tmp = notebook.properties["/meta/published"];
            }
        }        
        var hasPublicNotebook = tmp;
        if (Util.isDebug()) {
            this.log("hasPublicNotebook: " + hasPublicNotebook);
        }
        
        if (isPublicNotebook) {
        	var pos = item.properties["/meta/url"].indexOf("/");
        	if (pos != -1) {
        		var tmpname = item.properties["/meta/url"].substring(pos, item.properties["/meta/url"].length);
        		this.link = "http://springpad.com/#!/" + Settings.getSettings().username + "/notebooks" + tmpname + "/blocks";	
        	}
            
        }
        if (hasPublicNotebook && notebook !== null) {
            if (Util.isDebug()) {
                this.log("item: " + JSON.stringify(item) );
            }
            var nUrl = "notebooks" + String(notebook.properties["/meta/url"]).substring(8, notebook.properties["/meta/url"].length);
            this.link = "http://springpad.com/#!/" + Settings.getSettings().username + "/" + nUrl + "/blocks/" + item.properties["/meta/url"];
        }
        if (Util.isDebug()) {
            this.log("this.link: " + this.link);
        }

        
        // make persistent for this session
        this.hasSource = hasSource;
        this.hasPublicNotebook = hasPublicNotebook;
        this.isPublicNotebook = isPublicNotebook; 
        
        if (hasSource || hasPublicNotebook || isPublicNotebook) {

            var pos = { bottom : 49, right : 0 };
            var list = null;

            if (Platform.isWebOS()) {
                if(Settings.getSettings().online == true) {
                    list = this.$.shareList; //.openAt(pos);
                } else {
                    list = this.$.shareListOffline; //.openAt(pos);
                }
            } else {
                if(Settings.getSettings().online == true) {
                    list = this.$.shareListNonWebOS; //.openAt(pos);
                } else {
                    list = this.$.shareListOfflineNonWebOS; //.openAt(pos);
                }
            }
            
            if (list != null) {
                if (!isPublicNotebook) {
                    list.openAt(pos);
                } else {
                    list.openAtCenter();
                }
            }

        } else {
           this.$.noUrlDialog.openAtCenter();  
        }        
        if (Util.isDebug()) {
            this.log("END");
        }
    },
    
    popupShareItemSelect : function( inSender, inValue ) {
        if (Util.isDebug()) {
            this.log("START");
        }
        // this.log("inSender: " + inSender);
        // this.log("inValue: '" + inValue.value +"'");
        if (inValue !== undefined && Settings.getSettings().online == true) {
            switch (inValue.value) {
                case "0": 
                    this.shareItemByMail();
                    break;
                case "1": 
                    this.shareItemViaMessaging();
                    break;
                case "2": 
                    this.shareItemViaFacebook();
                    break;
                case "3":
                    this.shareItemViaTwitter();
                    break;            
                case "4":
                    this.shareItemViaGooglePlus();
                    break;     
                case "8": 
                    this.shareItemViaCreatePdf();
                    break;
                default: 
                    this.shareItemByMail();
                    break;
            }
        } if (inValue !== undefined && Settings.getSettings().online == false) {
            switch (inValue.value) {
                case "0": 
                    this.shareItemByMail();
                    break;
                case "1": 
                    this.shareItemViaMessaging();
                    break;
                default: 
                    break;
            }
        } else {
            if (Util.isDebug()) {
                this.log("inValue is undefined or client is offline!");
            }
        }
        if (Util.isDebug()) {
            this.log("END");
        }
    },
    
    shareItemByMail : function( ) {
        if (Util.isDebug()) {
            this.log("START");
        }
        var item = this.item;
        var title = item.name;
        var link = this.link;
        if (title == undefined || title == null || title == "") {
            title = enyo.fetchAppInfo().title + " - " + $L("Forwarded URL");
        }

        var text = link + "<br><br><br>---<br>" + $L("Sent by ") + enyo.fetchAppInfo().title + " - http://sven-ziegler.com";
        if (Platform.isBrowser()) {
            text = link + "\n\n\n---\n" + $L("Sent by ") + enyo.fetchAppInfo().title + " - http://sven-ziegler.com";
        }
        
        if (Platform.isWebOS()) {
            var params =  {
                "summary": title,
                "text": text, 
            };
            this.$.openEmailCall.call({"id": "com.palm.app.email", "params" : params});    
        } else if (Platform.isBlackBerry()) {
            var remote = new blackberry.transport.RemoteFunctionCall("blackberry/invoke/invoke");
            // alert("remote: " + remote);
            remote.addParam("appType", "mailto:?Subject=" + encodeURIComponent( title ) + "&body=" + encodeURIComponent( text ));
            // remote.addParam("appType", "mailto:?Subject=Test&body=Bla");
            remote.makeAsyncCall();
        } else {
            Platform.browser( "mailto:?Subject=" + encodeURIComponent( title ) + "&body=" + encodeURIComponent( text ), this )();
        }           
        if (Util.isDebug()) {
            this.log("END");
        }
    },
    
    shareItemViaCreatePdf : function( ) {
        if (Util.isDebug()) {
            this.log("START");
        }
        var item = this.item;
        var text = "Create PDF and send to me";
        var mail = "mypdf@joliprint.com";
        var link = this.link;
        if (Platform.isWebOS()) {
            var params =  {
                "summary": text,
                "text": link, 
                "recipients":[
                    {
                        "type": "email",
                        "contactDisplay":"PDF Creator", 
                        "role":1, 
                        "value": mail
                    }
                ],
            };
            this.$.openEmailCall.call({"id": "com.palm.app.email", "params" : params});    
        } else if (Platform.isBlackBerry()) {
            var remote = new blackberry.transport.RemoteFunctionCall("blackberry/invoke/invoke");
            remote.addParam("appType", "mailto:" + mail + "?Subject=" + encodeURIComponent( text ) + "&body=" + encodeURIComponent( link ));
            remote.makeAsyncCall();
        } else {
            Platform.browser( "mailto:" + mail + "?Subject=" + encodeURIComponent( text ) + "&body=" + encodeURIComponent( link ), this )();
        }
        if (Util.isDebug()) {
            this.log("END");
        }
    },

    shareItemViaMessaging : function( ) {
        if (Util.isDebug()) {
            this.log("START");
        }
        // this.log();
        var item = this.item;
        var link = this.link;
        var params =  { "compose": { "messageText" :  link }};
        this.$.launchAppCall.call({"id": "com.palm.app.messaging", "params" : params});    
        if (Util.isDebug()) {
            this.log("END");
        }
    },
    
    shareItemViaFacebook : function( ) {
        if (Util.isDebug()) {
            this.log("START");
        }
        var item = this.item;
        var link = this.link;
        var url = "http://www.facebook.com/sharer.php?u=" + link + "&t=" + item.name;
        Platform.browser( url, this )();
        if (Util.isDebug()) {
            this.log("END");
        }
    },
    
    shareItemViaTwitter : function( ) {
        if (Util.isDebug()) {
            this.log("START");
        }
        var item = this.item;
        var link = this.link;
        var url = "http://twitter.com/intent/tweet?via=" + encodeURIComponent(enyo.fetchAppInfo().title) + "&url=" + link; 
        Platform.browser( url, this )();
        if (Util.isDebug()) {
            this.log("END");
        }
    },
    
    shareItemViaGooglePlus : function( ) {
        if (Util.isDebug()) {
            this.log("START");
        }
        var item = this.item;
        var link = this.link;
        var url = "https://m.google.com/app/plus/x/?v=compose&content=" + link; 
        Platform.browser( url, this )();
        if (Util.isDebug()) {
            this.log("END");
        }
    },

    closeNoUrlDialog : function() {
        this.$.noUrlDialog.close();  
    },
    
 
});