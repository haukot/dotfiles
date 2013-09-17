enyo.kind({
    name: "AppMissing",
    kind: "Popup",
    //layoutKind: "VFlexLayout",
    height: "330px",
    width: (Platform.isTablet() ? "380px" : "320px"), 
    published: {
        appId: "",
        appTitle: ""
    },
    appTitleChanged: function() {
        this.validateComponents();
        this.$.message.setContent($L("You need the app <span style='color:#084774'>" + this.appTitle + "</span> to use this feature!"));
    },
    openAppCat: function() {
        this.validateComponents();
        this.$.launchApp.call({id: 'com.palm.app.enyo-findapps', params: {target: "http://developer.palm.com/appredirect/?packageid=" + this.appId}});
    },
    components: [
        {name: "message", allowHtml: true, style: "padding: 15px; font-size: 18pt; text-align: center"},
        {kind: "Button", onclick: "openAppCat", layoutKind: "HFlexLayout", align: "center", pack: "center", components: [
                {kind: "Image", src: "images/appcat_96x96.png"}, {content: $L("Get it now!"), style: "font-size: 25pt; padding: 10px"}
        ]},
        {kind: "Button", className: "enyo-button-dark", caption: $L("Close"), onclick: "close"},
        {name: "launchApp", kind: "PalmService", service: "palm://com.palm.applicationManager/", method: "open"}
    ]
});