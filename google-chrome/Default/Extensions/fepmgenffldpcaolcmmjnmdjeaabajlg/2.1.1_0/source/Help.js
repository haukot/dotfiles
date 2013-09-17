enyo.kind({
    name : "Help",
    kind: enyo.ModalDialog,
    layoutKind:"VFlexLayout",
    width: (Platform.isTablet() ? "480px" : "320px"),
    // caption: $L("Help"),
    events: {
        onAccept: ""
    },
    components: [
        {kind: "ApplicationEvents", onWindowHidden: "close"},
        {name: "launchAppCall", kind: "PalmService", service: "palm://com.palm.applicationManager/", method: "launch"},
        {name: "openEmailCall", kind: "PalmService", service: "palm://com.palm.applicationManager/", method: "open"},
        {kind: enyo.Scroller, flex: 1, height: (Platform.isTablet() ? Util.getAbsolutPixel( "h", 0.86, 95) : "365px"), autoHorizontal: false, horizontal: false, components: [
            {layoutKind: "VFlexLayout", components:[
                {kind : "RowGroup", caption : $L("Feedback & Support"), components : [
                    {kind : "Button", caption : $L("Support Thread @ webOS Nation Forum"), onclick : "openLink"},
                    {kind : "Button", caption : $L("E-Mail the Developer"), onclick : "sendMail"}
                ]}, 
                {kind : "RowGroup", caption : $L("Item List Icons - Top"), components : [
                    {kind : "HFlexBox", flex : 1, packed : "center", align : "center", components : [
                        {kind : "Image", height: "32px", src : "images/help-notebook.png", style: "margin-right: 10px;"}, 
                        {content : $L("Select Notebook."), style: "margin-right: 40px;"}
                    ]},
                    {kind : "HFlexBox", flex : 1, packed : "center", align : "center", components : [
                        {kind : "Image", height: "32px", src : "images/help-tags.png", style: "margin-right: 10px;"}, 
                        {content : $L("Filter the object list by tags."), style: "margin-right: 40px;"}
                    ]},
                    {kind : "HFlexBox", flex : 1, packed : "center", align : "center", components : [
                        {kind : "Image", height: "32px", src : "images/help-types.png", style: "margin-right: 10px;"}, 
                        {content : $L("Filter the object list by types."), style: "margin-right: 40px;"}
                    ]},
                ]},
                {kind : "RowGroup", caption : $L("Item List Icons - Bottom"), components : [
                    {kind : "HFlexBox", flex : 1, packed : "center", align : "center", components : [
                        {kind : "Image", src : "images/help-add.png", style: "margin-right: 10px;"}, 
                        {content : $L("Add a new object."), style: "margin-right: 40px;"}
                    ]}, 
                    {kind : "HFlexBox", flex : 1, packed : "center", align : "center", components : [
                        {kind : "Image", height: "32px", src : "images/help-sync.png", style: "margin-right: 10px;"}, 
                        {content : $L("Refresh the object list."), style: "margin-right: 40px;"}
                    ]},
                ]},
                {kind : "RowGroup", caption : $L("Item Details Icons - Top"), components : [
                    {kind : "HFlexBox", flex : 1, packed : "center", align : "center", components : [
                        {kind : "Image", height: "32px", src : "images/help-calendar.png", style: "margin-right: 10px;"}, 
                        {content : $L("Add entry to webOS calendar (only for date-related objects, like task, reminder and events)."), style: "margin-right: 40px;"}
                    ]},
                    {kind : "HFlexBox", flex : 1, packed : "center", align : "center", components : [
                        {kind : "Image", height: "32px", src : "images/help-add.png", style: "margin-right: 10px;"}, 
                        {content : $L("Add new item to list (only available for list-objects)."), style: "margin-right: 40px;"}
                    ]},
                    {kind : "HFlexBox", flex : 1, packed : "center", align : "center", components : [
                        {kind : "Image", height: "32px", src : "images/help-checkbox.png", style: "margin-right: 10px;"}, 
                        {content : $L("Show / hide all list-items."), style: "margin-right: 40px;"}
                    ]},
                    {kind : "HFlexBox", flex : 1, packed : "center", align : "center", components : [
                        {kind : "Image", height: "32px", src : "images/help-attachment.png", style: "margin-right: 10px;"}, 
                        {content : $L("Manage attachments."), style: "margin-right: 40px;"}
                    ]},
                    {kind : "HFlexBox", flex : 1, packed : "center", align : "center", components : [
                        {kind : "Image", height: "32px", src : "images/help-edit.png", style: "margin-right: 10px;"}, 
                        {content : $L("Edit object."), style: "margin-right: 40px;"}
                    ]},
                    {kind : "HFlexBox", flex : 1, packed : "center", align : "center", components : [
                        {kind : "Image", height: "32px", src : "images/help-delete.png", style: "margin-right: 10px;"}, 
                        {content : $L("Delete item (only available if activated in preferences)."), style: "margin-right: 40px;"}
                    ]},
                ]},
                {kind : "RowGroup", caption : $L("Item Details Icons - Bottom"), components : [
                    {kind : "HFlexBox", flex : 1, packed : "center", align : "center", components : [
                        {kind : "Image", height: "32px", src : "images/help-mark.png", style: "margin-right: 10px;"}, 
                        {content : $L("Enabling / disabling highlighting of search results (only available after search)."), style: "margin-right: 40px;"}
                    ]},
                    {kind : "HFlexBox", flex : 1, packed : "center", align : "center", components : [
                        {kind : "Image", height: "32px", src : "images/help-share.png", style: "margin-right: 10px;"}, 
                        {content : $L("Share URL via mail, messaging, facebook, twitter, google plus and pdf creation."), style: "margin-right: 40px;"}
                    ]},
                    {kind : "HFlexBox", flex : 1, packed : "center", align : "center", components : [
                        {kind : "Image", height: "32px", src : "images/help-font.png", style: "margin-right: 10px;"}, 
                        {content : $L("Configure font settings (size, family & linespacing)."), style: "margin-right: 40px;"}
                    ]},
                    {kind : "HFlexBox", flex : 1, packed : "center", align : "center", components : [
                        {kind : "Image", height: "32px", src : "images/help-max.png", style: "margin-right: 10px;"}, 
                        {content : $L("Switch to special fullscreen mode. After switching tap on the headline to hide / unhide the top and bottom toolbar!"), style: "margin-right: 40px;"}
                    ]},
                ]},
            ]}
        ]},
        {name: "buttonOrientation", layoutKind: "HFlexLayout", components: [
            {name: "acceptButton", kind: "Button", style: "margin-top: 10px;", flex:1, caption: $L("Close"), onclick: "acceptButtonClick", className: "enyo-button-affirmative"}
        ]},
        
    ],
    
    sendMail : function() {
        if (Util.isDebug()) {
            this.log("START");
        }
        var appinfo = enyo.fetchAppInfo();
        var title = appinfo.title + ", Version: " + appinfo.version + " (" + Util.deviceName + ")"; 
        var mail = appinfo.vendormail;
        if (Platform.isWebOS()) {
            var params =  {
                "summary": title,
                "recipients": [{"value" : mail}],
                "text": "" 
            };
            this.$.openEmailCall.call({"id": "com.palm.app.email", "params" : params});    
        } else if (Platform.isBlackBerry()) {
            var remote = new blackberry.transport.RemoteFunctionCall("blackberry/invoke/invoke");
            remote.addParam("appType", "mailto:" + mail + "?Subject=" + encodeURIComponent( title ) );
            remote.makeAsyncCall();
        }
        if (Util.isDebug()) {
            this.log("END");
        }
    },

    openLink : function( ) {        
        if (Util.isDebug()) {
            this.log("START");
        }
        var url = "http://forums.webosnation.com/hp-touchpad-apps/313470-meorg-finally-springpad-client-webos-import-evernote-google-note.html";
        // if (Settings.getSettings().online == true) {
            if (Settings.getSettings().useAdvancedBrowser == false) {
                this.$.launchAppCall.call({"id": "com.palm.app.browser", "params":{"target": url}});
            } else {
                this.$.launchAppCall.call({"id": "com.maklesoft.browser", "params":{"url": url}});
            }
        // }
        if (Util.isDebug()) {
            this.log("END");
        }
    },
    
    acceptButtonClick: function() {
        this.doAccept();
        this.close();
    },
    
    
});
