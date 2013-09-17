enyo.kind({
    name: "ChangelogDialog",
    kind: enyo.ModalDialog,
    layoutKind:"VFlexLayout",
    width: (Platform.isTablet() ? "550px" : "320px"), 
    events: {
        onAccept: ""
    },
    components: [
        {kind: "ApplicationEvents", onWindowHidden: "close"},
        {name: "changelogData", kind: "ReadOnTouch.ReadChangelog"},
        {kind: enyo.Scroller, flex: 1, height: (Platform.isTablet() ? "360px" : "260px"), autoVertical: false, horizontal: false, components: [
            {name: "wwwLabel"/*, style: "background: #fff"*/, flex: 1, kind: "HtmlContent", allowHtml: true, className:"enyo-paragraph"},
        ]},
        {name: "buttonOrientation", layoutKind: "HFlexLayout", components: [
            {name: "acceptButton", kind: "Button", flex:1, caption: $L("OK"), onclick: "acceptButtonClick"}
        ]},
    ],
    
    rendered : function () {
        this.inherited(arguments);
        var version = localStorage.getItem("lastVersion");
        this.setCaption($L("What's new in Version ") + version + "?");
    },
    
    updateContent : function( str ) {
        this.$.wwwLabel.setContent( str );
    },
    
    acceptButtonClick: function() {
        this.doAccept();
        this.close();
    },
    
});